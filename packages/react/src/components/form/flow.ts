import { User } from "@slashid/slashid";
import {
  Cancel,
  LogIn,
  LoginConfiguration,
  Retry,
  MFA,
  LoginOptions,
} from "../../domain/types";
import { ensureError } from "../../domain/errors";

export interface InitialState {
  status: "initial";
  logIn: (config: LoginConfiguration, options?: LoginOptions) => void;
}

export interface AuthenticatingState {
  status: "authenticating";
  context: {
    config: LoginConfiguration;
    options?: LoginOptions;
    attempt: number;
  };
  retry: Retry;
  cancel: Cancel;
  entry: () => void;
}

export interface SuccessState {
  status: "success";
}

export interface ErrorState {
  status: "error";
  context: AuthenticatingState["context"] & {
    error: Error;
  };
  retry: Retry;
  cancel: Cancel;
}

interface LoginEvent {
  type: "sid_login";
  config: LoginConfiguration;
  options?: LoginOptions;
}

interface LoginSuccessEvent {
  type: "sid_login.success";
  user: User;
}

interface LoginErrorEvent {
  type: "sid_login.error";
  error: Error;
}

interface CancelEvent {
  type: "sid_cancel";
}

interface RetryEvent {
  type: "sid_retry";
  context: AuthenticatingState["context"];
}

interface InitEvent {
  type: "sid_init";
}

type Event =
  | InitEvent
  | LoginEvent
  | LoginSuccessEvent
  | LoginErrorEvent
  | RetryEvent
  | CancelEvent;

type FlowActions = {
  // a function that will be called when the state is entered
  entry?: () => void;
};

export type FlowState = FlowActions &
  (InitialState | AuthenticatingState | SuccessState | ErrorState);

type Observer = (state: FlowState, event: Event) => void;
type Send = (e: Event) => void;

const createInitialState = (send: Send): InitialState => {
  return {
    status: "initial",
    logIn: (config, options) => {
      send({ type: "sid_login", config, options });
    },
  };
};

const createAuthenticatingState = (
  send: Send,
  context: AuthenticatingState["context"],
  logInFn: LogIn | MFA
): AuthenticatingState => {
  // to be called when the state is entered
  function performLogin() {
    return logInFn(context.config, context.options)
      .then((user) => {
        if (user) {
          send({ type: "sid_login.success", user });
        } else {
          send({
            type: "sid_login.error",
            error: new Error("User not returned from /id"),
          });
        }
      })
      .catch((error) => {
        send({ type: "sid_login.error", error });
      });
  }

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
    cancel: () => {
      // Cancellation API needs to be exposed from the core SDK
      send({ type: "sid_cancel" });
    },
    entry: performLogin,
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

export type CreateFlowOptions = {
  onSuccess?: (user: User) => void;
  onError?: (error: Error, context: ErrorState["context"]) => void;
};

type HistoryEntry = {
  state: FlowState;
  event: Event;
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
        if (!logInFn) break;

        const loginContext: AuthenticatingState["context"] = {
          config: e.config,
          options: e.options,
          attempt: 1,
        };

        setState(createAuthenticatingState(send, loginContext, logInFn), e);
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
        if (!logInFn) break;

        const retryContext: AuthenticatingState["context"] = {
          config: e.context.config,
          options: e.context.options,
          attempt: e.context.attempt + 1,
        };

        setState(createAuthenticatingState(send, retryContext, logInFn), e);
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
    // SDK is instantiated asynchronously, so we need to set the logIn function when it is ready
    setLogIn: (fn: LogIn | MFA) => {
      logInFn = fn;
    },
    state,
  };
}

export type Flow = ReturnType<typeof createFlow>;
