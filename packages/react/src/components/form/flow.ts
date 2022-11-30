import { LogIn, LoginOptions, Retry } from "../../domain/types";

export interface InitialState {
  status: "initial";
  logIn: (options: LoginOptions) => void;
}

export interface AuthenticatingState {
  status: "authenticating";
  context: {
    options: LoginOptions;
  };
  retry: Retry;
}

export interface SuccessState {
  status: "success";
}

export interface ErrorState {
  status: "error";
}

interface LoginEvent {
  type: "sid_login";
  options: LoginOptions;
}

interface RetryEvent {
  type: "sid_retry";
}

type Event = LoginEvent | RetryEvent;

export type FlowState =
  | InitialState
  | AuthenticatingState
  | SuccessState
  | ErrorState;

type Observer = (status: FlowState) => void;
type Send = (e: Event) => void;

const createInitialState = (send: Send): InitialState => {
  return {
    status: "initial",
    logIn: (options: LoginOptions) => {
      send({ type: "sid_login", options });
    },
  };
};

const createAuthenticatingState = (
  send: Send,
  context: { options: LoginOptions }
): AuthenticatingState => {
  return {
    status: "authenticating",
    context,
    retry: () => {
      send({ type: "sid_retry" });
    },
  };
};

const createSuccessState = (): SuccessState => {
  return {
    status: "success",
  };
};

const createErrorState = (): ErrorState => {
  return {
    status: "error",
  };
};

export function createFlow() {
  let observers: Observer[] = [];
  const send = (event: Event) => {
    processEvent(event);
  };
  let state: FlowState = createInitialState(send);
  let logInFn: undefined | LogIn = undefined;

  function setState(s: FlowState) {
    state = s;
    observers.forEach((o) => o(state));
  }

  async function processEvent(e: Event) {
    switch (e.type) {
      case "sid_login":
        if (logInFn) {
          setState(createAuthenticatingState(send, { options: e.options }));
          try {
            await logInFn(e.options);
            setState(createSuccessState());
          } catch (e) {
            setState(createErrorState());
          }
        }
    }
  }

  return {
    send,
    unsubscribe: (observer: Observer) => {
      observers = observers.filter((ob) => ob === observer);
    },
    subscribe: (observer: Observer) => {
      observers.push(observer);
    },
    setLogIn: (fn: LogIn) => {
      logInFn = fn;
    },
    state,
  };
}

export type Flow = ReturnType<typeof createFlow>;
