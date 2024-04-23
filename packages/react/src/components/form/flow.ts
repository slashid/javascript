import { SlashID } from "@slashid/slashid";
import { LogIn, MFA, Recover } from "../../domain/types";
import { ensureError } from "../../domain/errors";
import { isFactorRecoverable } from "../../domain/handles";
import { createUIStateMachine } from "./state/ui-state-machine";
import type {
  Event,
  Send,
  InitialState,
  AuthenticatingState,
  SuccessState,
  ErrorState,
  CreateFlowOptions,
  FlowState,
  HistoryEntry,
  Observer,
} from "./flow.types";

const createInitialState = (send: Send): InitialState => {
  return {
    status: "initial",
    logIn: (config, options) => {
      send({ type: "sid_login", config, options });
    },
  };
};

const createInitialAuthenticatingState = (
  send: Send,
  context: AuthenticatingState["context"],
  logInFn: LogIn | MFA,
  recoverFn: Recover,
  sid: SlashID
): AuthenticatingState => {
  async function recover() {
    if (!isFactorRecoverable(context.config.factor) || !context.config.handle)
      return;

    try {
      return await recoverFn({
        factor: context.config.factor,
        handle: context.config.handle,
      });

      // recover does not authenticate on its own
      // we still need to wait for login to complete
    } catch (error) {
      send({ type: "sid_login.error", error: ensureError(error) });
    }
  }

  const uiStateMachine = createUIStateMachine({
    send,
    sid,
    context,
    logInFn,
    recover,
  });

  return {
    status: "authenticating",
    context: {
      attempt: context.attempt,
      config: context.config,
      options: context.options,
    },
    retry: () => {
      send({ type: "sid_retry", context });
    },
    recover,
    cancel: () => {
      // Cancellation API needs to be exposed from the core SDK
      send({ type: "sid_cancel" });
    },
    entry: () => {
      if (uiStateMachine.state.entry) {
        uiStateMachine.state.entry();
      }
    },
    matches: (pattern: string) => {
      return `authenticating.${uiStateMachine.state.status}`.includes(pattern);
    },
    getChildState: () => {
      return uiStateMachine.state;
    },
  };
};

const createSuccessState = (): SuccessState => {
  return {
    status: "success",
  };
};

const createErrorState = (
  send: Send,
  context: ErrorState["context"]
): ErrorState => {
  return {
    status: "error",
    context,
    retry: () => {
      send({ type: "sid_retry", context });
    },
    cancel: () => {
      send({ type: "sid_cancel" });
    },
  };
};

/**
 * Flow API factory function.
 *
 * Responsible for creating the flow state machine and providing the flow API.
 * Internally it delegates event processing to the underlying state instances.
 *
 * When a transition is requested, this function will create a new state instance and notify subscribers.
 * It will not do any checks to see if the transition is valid as it is the responsibility of the state instances.
 *
 * The Flow API is not symetric - external code can interact with it using the fields and methods of the state object.
 * Internally the state object communicates with the flow using the send function, emitting events and letting the flow API orchestrate the state transitions.
 *
 * @param opts
 * @returns
 */
export function createFlow(opts: CreateFlowOptions = {}) {
  let logInFn: undefined | LogIn | MFA = undefined;
  let recoverFn: undefined | Recover = undefined;
  let sid: undefined | SlashID = undefined;
  let observers: Observer[] = [];
  const send = (event: Event) => {
    transition(event);
  };

  let state: FlowState = createInitialState(send);
  // each history entry contains a state and the event that triggered the transition to that state
  const history: HistoryEntry[] = [{ state, event: { type: "sid_init" } }];

  const { onSuccess, onError } = opts;

  // notify subscribers every time the state changes
  function setState(newState: FlowState, changeEvent: Event) {
    state = newState;

    // keep a history of state transitions for debugging purposes
    history.push({ state, event: changeEvent });

    // trigger the state entry function if present
    if (typeof state.entry === "function") {
      state.entry();
    }

    observers.forEach((o) => o(state, changeEvent));
  }

  async function transition(e: Event) {
    switch (e.type) {
      case "sid_login":
        // TODO replace with a check for ready state
        if (!logInFn || !recoverFn) break;

        const loginContext: AuthenticatingState["context"] = {
          config: e.config,
          options: e.options,
          attempt: 1,
        };

        setState(
          createInitialAuthenticatingState(
            send,
            loginContext,
            logInFn,
            recoverFn,
            sid!
          ),
          e
        );
        break;

      case "sid_login.ui_state_changed":
        // change state object reference for reactivity
        setState({ ...state }, e);
        break;
      case "sid_login.success":
        // call onSuccess if present
        if (typeof onSuccess === "function") {
          onSuccess(e.user);
        }

        setState(createSuccessState(), e);
        break;
      case "sid_login.error":
        if (state.status !== "authenticating") break;

        const errorContext: ErrorState["context"] = {
          ...state.context,
          error: ensureError(e.error),
        };

        // call onError if present
        if (typeof onError === "function") {
          onError(e.error, errorContext);
        }

        setState(createErrorState(send, errorContext), e);
        break;
      case "sid_retry":
        // TODO replace with a check for ready state
        if (!logInFn || !recoverFn) break;

        const retryContext: AuthenticatingState["context"] = {
          config: e.context.config,
          options: e.context.options,
          attempt: e.context.attempt + 1,
        };

        setState(
          createInitialAuthenticatingState(
            send,
            retryContext,
            logInFn,
            recoverFn,
            sid!
          ),
          e
        );
        break;
      case "sid_cancel":
        setState(createInitialState(send), e);
        break;
      default:
        break;
    }
  }

  // provide the flow API - interact with the flow using the state object, subscribe and unsubscribe to state changes
  return {
    history,
    unsubscribe: (observer: Observer) => {
      observers = observers.filter((ob) => ob === observer);
    },
    subscribe: (observer: Observer) => {
      observers.push(observer);
    },
    // SDK is instantiated asynchronously, so we need to set the logIn and recover functions when it is ready
    setLogIn: (fn: LogIn | MFA) => {
      logInFn = fn;
    },
    setRecover: (fn: Recover) => {
      recoverFn = fn;
    },
    setSlashID: (s: SlashID) => {
      sid = s;
    },
    state,
  };
}
