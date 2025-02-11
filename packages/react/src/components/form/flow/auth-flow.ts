import { Cancel, LogIn, MFA, Recover } from "../../../domain/types";
import {
  CreateFlowOptions,
  Observer,
  Event,
  createInitialState,
  HistoryEntry,
  createTransitionFunction,
  FlowState,
  FlowHandlers,
  loginHandler,
  storeRecoveryCodesHandler,
  loginUpdateContextHandler,
  loginSuccessHandler,
  loginErrorHandler,
  retryHandler,
} from "./flow.common";

const authFlowHandlers: FlowHandlers = {
  sid_login: loginHandler,
  sid_storeRecoveryCodes: storeRecoveryCodesHandler,
  "sid_login.update_context": loginUpdateContextHandler,
  "sid_login.success": loginSuccessHandler,
  "sid_login.error": loginErrorHandler,
  sid_retry: retryHandler,
  sid_cancel: (event, state, deps) => {
    const cancelFn = deps.getCancelFn();
    if (cancelFn) {
      cancelFn();
    }

    deps.setState(createInitialState(deps.send), event);
  },
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
export function createAuthFlow(opts: CreateFlowOptions = {}) {
  let state: FlowState;
  let logInFn: undefined | LogIn | MFA = undefined;
  let recoverFn: undefined | Recover = undefined;
  let cancelFn: undefined | Cancel = undefined;
  let recoveryCodes: undefined | string[] = undefined;
  let observers: Observer[] = [];
  const send = (event: Event) => {
    transition(event, state);
  };

  state = createInitialState(send);
  // each history entry contains a state and the event that triggered the transition to that state
  const history: HistoryEntry[] = [{ state, event: { type: "sid_init" } }];

  // notify subscribers every time the state changes
  function setState(newState: FlowState, changeEvent: Event) {
    state = newState;

    // keep a history of state transitions for debugging purposes
    history.push({ state, event: changeEvent });

    observers.forEach((o) => o(state, changeEvent));
  }

  const transition = createTransitionFunction(
    {
      send,
      setState,
      getLogInFn: () => logInFn,
      getRecoverFn: () => recoverFn,
      getCancelFn: () => cancelFn,
      onSuccess: opts.onSuccess,
      onError: opts.onError,
      getRecoveryCodes: () => recoveryCodes,
      setRecoveryCodes: (codes) => {
        recoveryCodes = codes;
      },
      propagateFlowCancelledError: false,
    },
    authFlowHandlers
  );

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
    state,
  };
}

export type Flow = ReturnType<typeof createAuthFlow>;
