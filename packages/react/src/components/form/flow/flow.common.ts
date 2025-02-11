import { Utils, Errors, User, ReachablePersonHandle } from "@slashid/slashid";
import {
  Cancel,
  LogIn,
  LoginConfiguration,
  Retry,
  MFA,
  LoginOptions,
  Recover,
  RetryPolicy,
} from "../../../domain/types";
import { ensureError } from "../../../domain/errors";
import { isFactorRecoverable } from "../../../domain/handles";
import { StoreRecoveryCodesState } from "../store-recovery-codes";
import { Handle } from "../../../domain/types";

export type AuthnContext = {
  config: LoginConfiguration;
  options?: LoginOptions;
  attempt: number;
};

export interface InitialState {
  status: "initial";
  logIn: (config: LoginConfiguration, options?: LoginOptions) => void;
}

export interface AuthenticatingState {
  status: "authenticating";
  context: AuthnContext;
  retry: Retry;
  cancel: Cancel;
  updateContext: (context: AuthnContext) => void;
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

export interface LoginEvent {
  type: "sid_login";
  config: LoginConfiguration;
  options?: LoginOptions;
}

export interface UpdateAuthnContextEvent {
  type: "sid_login.update_context";
  context: AuthnContext;
}

export interface LoginSuccessEvent {
  type: "sid_login.success";
  user: User;
}

export interface LoginErrorEvent {
  type: "sid_login.error";
  error: Error;
}

export interface CancelEvent {
  type: "sid_cancel";
}

export interface RetryEvent {
  type: "sid_retry";
  context: AuthenticatingState["context"];
  policy: RetryPolicy;
}

export interface InitEvent {
  type: "sid_init";
}

export interface StoreRecoveryCodesEvent {
  type: "sid_storeRecoveryCodes";
  user: User;
}

export type Event =
  | InitEvent
  | LoginEvent
  | UpdateAuthnContextEvent
  | LoginSuccessEvent
  | LoginErrorEvent
  | RetryEvent
  | CancelEvent
  | StoreRecoveryCodesEvent;

type FlowActions = {
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

export type Observer = (state: FlowState, event: Event) => void;
export type Send = (e: Event) => void;

export const createInitialState = (send: Send): InitialState => {
  return {
    status: "initial",
    logIn: (config, options) => {
      send({ type: "sid_login", config, options });
    },
  };
};

export const createAuthenticatingState = (
  send: Send,
  context: AuthenticatingState["context"],
  logInFn: LogIn | MFA,
  recoverFn: Recover,
  setRecoveryCodes: (codes: string[]) => void,
  propagateFlowCancelled: boolean
): AuthenticatingState => {
  function performLogin() {
    if (!logInFn) return;
    return logInFn(context.config, context.options)
      .then((user) => {
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
        if (Errors.isFlowCancelledError(error)) {
          if (propagateFlowCancelled) {
            throw error;
          }
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

    if (!isFactorRecoverable(context.config.factor)) return;

    try {
      return await recoverFn({
        factor: context.config.factor,
        handle: context.config.handle as ReachablePersonHandle,
      });
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
      send({ type: "sid_cancel" });
    },
    logIn: performLogin,
    setRecoveryCodes,
    updateContext: (newContext: AuthnContext) => {
      send({
        type: "sid_login.update_context",
        context: newContext,
      });
    },
  };
};

export const createSuccessState = (): SuccessState => {
  return {
    status: "success",
  };
};

export const createErrorState = (
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

export const createStoreRecoveryCodesState = (
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

export type HistoryEntry = {
  state: FlowState;
  event: Event;
};

export type CreateFlowOptions = {
  oid?: string;
  onSuccess?: (user: User) => void;
  onError?: (error: Error, context: ErrorState["context"]) => void;
  logInFn?: LogIn | MFA;
  recover?: Recover;
  cancelFn?: Cancel;
  lastUserHandle?: Handle;
};

type AsyncDependencies = {
  getLogInFn: () => LogIn | MFA | undefined;
  getRecoverFn: () => Recover | undefined;
  getCancelFn: () => Cancel | undefined;
};

type StaticDependencies = {
  send: (event: Event) => void;
  setState: (state: FlowState, event: Event) => void;
  onSuccess?: (user: User) => void;
  onError?: (
    error: Error,
    context: AuthenticatingState["context"] & { error: Error }
  ) => void;
  getRecoveryCodes: () => string[] | undefined;
  setRecoveryCodes: (codes: string[]) => void;
  propagateFlowCancelledError: boolean;
};

type FlowDependencies = AsyncDependencies & StaticDependencies;

type TransitionHandler = (
  event: Event,
  state: FlowState,
  deps: FlowDependencies
) => void;

const isSDKReady = (deps: FlowDependencies): boolean => {
  return !!(deps.getLogInFn() && deps.getRecoverFn());
};

export const loginHandler: TransitionHandler = (event, state, deps) => {
  if (!isSDKReady(deps)) return;
  const e = event as Event & { type: "sid_login" };
  const logInFn = deps.getLogInFn()!;
  const recoverFn = deps.getRecoverFn()!;

  const loginContext: AuthenticatingState["context"] = {
    config: e.config,
    options: e.options,
    attempt: 1,
  };

  deps.setState(
    createAuthenticatingState(
      deps.send,
      loginContext,
      logInFn,
      recoverFn,
      deps.setRecoveryCodes,
      deps.propagateFlowCancelledError
    ),
    event
  );
};

export const storeRecoveryCodesHandler: TransitionHandler = (
  event,
  state,
  deps
) => {
  const e = event as Event & { type: "sid_storeRecoveryCodes" };
  const codes = deps.getRecoveryCodes();

  if (!codes) {
    deps.send({ type: "sid_login.success", user: e.user });
    return;
  }

  deps.setState(createStoreRecoveryCodesState(deps.send, codes, e.user), event);
};

export const loginUpdateContextHandler: TransitionHandler = (
  event,
  state,
  deps
) => {
  if (!isSDKReady(deps)) return;
  const e = event as Event & { type: "sid_login.update_context" };
  const logInFn = deps.getLogInFn()!;
  const recoverFn = deps.getRecoverFn()!;

  deps.setState(
    createAuthenticatingState(
      deps.send,
      e.context,
      logInFn,
      recoverFn,
      deps.setRecoveryCodes,
      deps.propagateFlowCancelledError
    ),
    event
  );
};

export const loginSuccessHandler: TransitionHandler = (event, state, deps) => {
  const e = event as Event & { type: "sid_login.success" };

  if (deps.onSuccess) {
    deps.onSuccess(e.user);
  }

  deps.setState(createSuccessState(), event);
};

export const loginErrorHandler: TransitionHandler = (event, state, deps) => {
  if (state.status !== "authenticating") return;
  const e = event as Event & { type: "sid_login.error" };

  const errorContext = {
    ...state.context,
    error: ensureError(e.error),
  };

  if (deps.onError) {
    deps.onError(e.error, errorContext);
  }

  deps.setState(createErrorState(deps.send, errorContext), event);
};

export const retryHandler: TransitionHandler = (event, state, deps) => {
  if (!isSDKReady(deps)) return;
  const e = event as Event & { type: "sid_retry" };
  const logInFn = deps.getLogInFn()!;
  const recoverFn = deps.getRecoverFn()!;
  const cancelFn = deps.getCancelFn();

  if (cancelFn) {
    cancelFn();
  }

  if (e.policy === "reset") {
    deps.setState(createInitialState(deps.send), event);
    return;
  }

  deps.setState(
    createAuthenticatingState(
      deps.send,
      {
        ...e.context,
        attempt: e.context.attempt + 1,
      },
      logInFn,
      recoverFn,
      deps.setRecoveryCodes,
      deps.propagateFlowCancelledError
    ),
    event
  );
};

export type FlowHandlers = Partial<Record<Event["type"], TransitionHandler>>;

export function createTransitionFunction(
  deps: FlowDependencies,
  handlers: FlowHandlers
) {
  return function transition(event: Event, state: FlowState) {
    const handler = handlers[event.type];
    if (handler) {
      handler(event, state, deps);
    }
  };
}
