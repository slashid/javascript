import {
  Utils,
  Errors,
  User,
  ReachablePersonHandle,
  SlashID,
} from "@slashid/slashid";
import {
  Cancel,
  LogIn,
  LoginConfiguration,
  Retry,
  MFA,
  LoginOptions,
  Recover,
  RetryPolicy,
} from "../../domain/types";
import { ensureError } from "../../domain/errors";
import { isFactorRecoverable } from "../../domain/handles";
import { StoreRecoveryCodesState } from "./store-recovery-codes";
import { OrgRetargetChallengeReceivedEvent } from "@slashid/slashid";

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
  recover: () => void;
  logIn: () => void;
  setRecoveryCodes: (codes: string[]) => void;
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

interface LoginRetargetEvent {
  type: "sid_login.retarget";
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
  policy: RetryPolicy;
}

interface InitEvent {
  type: "sid_init";
}

interface StoreRecoveryCodesEvent {
  type: "sid_storeRecoveryCodes";
  user: User;
}

type Event =
  | InitEvent
  | LoginEvent
  | LoginRetargetEvent
  | LoginSuccessEvent
  | LoginErrorEvent
  | RetryEvent
  | CancelEvent
  | StoreRecoveryCodesEvent;

type FlowActions = {
  // a function that will be called when the state is entered
  entry?: () => void;
};

export type FlowState = FlowActions &
  (
    | InitialState
    | AuthenticatingState
    | SuccessState
    | ErrorState
    | StoreRecoveryCodesState
  );

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
  sdk: SlashID,
  logInFn: LogIn | MFA,
  recoverFn: Recover,
  setRecoveryCodes: (codes: string[]) => void
): AuthenticatingState => {
  function performLogin() {
    const loginPromise = logInFn(context.config, context.options);

    // immediately subscribe to SDK retarget event which changes context
    const handleRetargetEvent = (event: OrgRetargetChallengeReceivedEvent) => {
      // update context and force a re-render
      if (!event.factor || !event?.factor?.method) {
        return;
      }
      send({
        type: "sid_login.retarget",
        // @ts-expect-error TODO @ivan figure out how to assert this
        config: { factor: event.factor },
        options: context.options,
      });
    };

    sdk.subscribe("orgRetargetChallengeReceived", handleRetargetEvent);

    return loginPromise
      .then((user) => {
        sdk.unsubscribe("orgRetargetChallengeReceived", handleRetargetEvent);
        if (!user) {
          send({
            type: "sid_login.error",
            error: new Error("User not returned from /id"),
          });
          return;
        }

        if (context.config.factor.method === "totp") {
          send({
            type: "sid_storeRecoveryCodes",
            user,
          });
          return;
        }
        send({ type: "sid_login.success", user });
      })
      .catch((error) => {
        sdk.unsubscribe("orgRetargetChallengeReceived", handleRetargetEvent);
        if (Errors.isFlowCancelledError(error)) {
          return;
        }
        send({ type: "sid_login.error", error });
      });
  }

  async function recover() {
    if (
      !context.config.handle?.type ||
      !Utils.isReachablePersonHandleType(context.config.handle.type)
    ) {
      send({
        type: "sid_login.error",
        error: Errors.createSlashIDError({
          name: Errors.ERROR_NAMES.recoverNonReachableHandleType,
          message: "Recovery requires a reachable handle type.",
          context,
        }),
      });
      return;
    }

    // not possible at the moment
    if (!isFactorRecoverable(context.config.factor)) return;

    try {
      return await recoverFn({
        factor: context.config.factor,
        handle: context.config.handle as ReachablePersonHandle,
      });

      // recover does not authenticate on its own
      // we still need to wait for login to complete
    } catch (error) {
      send({ type: "sid_login.error", error: ensureError(error) });
    }
  }

  return {
    status: "authenticating",
    context: {
      attempt: context.attempt,
      config: context.config,
      options: context.options,
    },
    retry: (policy = "retry") => {
      send({ type: "sid_retry", context, policy });
    },
    recover,
    cancel: () => {
      // Cancellation API needs to be exposed from the core SDK
      send({ type: "sid_cancel" });
    },
    logIn: performLogin,
    setRecoveryCodes,
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
    retry: (policy = "retry") => {
      send({ type: "sid_retry", context, policy });
    },
    cancel: () => {
      send({ type: "sid_cancel" });
    },
  };
};

const createStoreRecoveryCodesState = (
  send: Send,
  recoveryCodes: string[],
  user: User
): StoreRecoveryCodesState => {
  return {
    status: "storeRecoveryCodes",
    context: {
      recoveryCodes,
    },
    confirm: () => {
      send({ type: "sid_login.success", user });
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
  let recoverFn: undefined | Recover = undefined;
  let cancelFn: undefined | Cancel = undefined;
  let sid: undefined | SlashID = undefined;
  let recoveryCodes: undefined | string[] = undefined;
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

    observers.forEach((o) => o(state, changeEvent));
  }

  const setRecoveryCodes = (codes: string[]) => {
    recoveryCodes = codes;
  };

  async function transition(e: Event) {
    switch (e.type) {
      case "sid_login":
        // TODO replace with a check for ready state
        if (!logInFn || !recoverFn || !sid) break;

        const loginContext: AuthenticatingState["context"] = {
          config: e.config,
          options: e.options,
          attempt: 1,
        };

        setState(
          createAuthenticatingState(
            send,
            loginContext,
            sid,
            logInFn,
            recoverFn,
            setRecoveryCodes
          ),
          e
        );
        break;
      case "sid_storeRecoveryCodes":
        // recovery codes are only stored on register authenticator
        if (!recoveryCodes) {
          send({ type: "sid_login.success", user: e.user });
          break;
        }

        setState(
          createStoreRecoveryCodesState(send, recoveryCodes!, e.user),
          e
        );
        break;
      case "sid_login.retarget":
        {
          if (!logInFn || !recoverFn || !sid) break;

          const loginContext: AuthenticatingState["context"] = {
            config: e.config,
            options: e.options,
            attempt: 1,
          };

          setState(
            createAuthenticatingState(
              send,
              loginContext,
              sid,
              logInFn,
              recoverFn,
              setRecoveryCodes
            ),
            e
          );
        }
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
        if (!logInFn || !recoverFn || !sid) break;

        if (typeof cancelFn === "function") {
          cancelFn();
        }

        if (e.policy === "reset") {
          setState(createInitialState(send), e);
          break;
        }

        const retryContext: AuthenticatingState["context"] = {
          config: e.context.config,
          options: e.context.options,
          attempt: e.context.attempt + 1,
        };

        setState(
          createAuthenticatingState(
            send,
            retryContext,
            sid,
            logInFn,
            recoverFn,
            setRecoveryCodes
          ),
          e
        );
        break;
      case "sid_cancel":
        if (typeof cancelFn === "function") {
          cancelFn();
        }

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
    setCancel: (fn: Cancel) => {
      cancelFn = fn;
    },
    setSdk: (sdk: SlashID) => {
      sid = sdk;
    },
    state,
  };
}

export type Flow = ReturnType<typeof createFlow>;
