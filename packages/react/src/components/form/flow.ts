import { User } from "@slashid/slashid";
import { Cancel, LogIn, LoginConfiguration, Retry, MFA, LoginOptions } from "../../domain/types";

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
}

export interface SuccessState {
  status: "success";
}

export interface ErrorState {
  status: "error";
  cancel: Cancel;
}

interface LoginEvent {
  type: "sid_login";
  config: LoginConfiguration;
  options?: LoginOptions;
}

interface CancelEvent {
  type: "sid_cancel";
}

interface RetryEvent {
  type: "sid_retry";
}

type Event = LoginEvent | RetryEvent | CancelEvent;

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
    logIn: (config, options) => {
      send({ type: "sid_login", config, options });
    },
  };
};

const createAuthenticatingState = (
  send: Send,
  context: { config: LoginConfiguration, options?: LoginOptions }
): AuthenticatingState => {
  return {
    status: "authenticating",
    context: {
      attempt: 0,
      config: context.config,
      options: context.options
    },
    retry: () => {
      send({ type: "sid_retry" });
    },
    cancel: () => {
      send({ type: "sid_cancel" });
    },
  };
};

const createSuccessState = (): SuccessState => {
  return {
    status: "success",
  };
};

const createErrorState = (send: Send): ErrorState => {
  return {
    status: "error",
    cancel: () => {
      send({ type: "sid_cancel" });
    },
  };
};

export type CreateFlowOptions = {
  onSuccess?: (user: User) => void;
};

export function createFlow(opts: CreateFlowOptions = {}) {
  let observers: Observer[] = [];
  const send = (event: Event) => {
    processEvent(event);
  };
  let state: FlowState = createInitialState(send);
  let logInFn: undefined | LogIn | MFA = undefined;
  const { onSuccess } = opts;

  function setState(s: FlowState) {
    state = s;
    observers.forEach((o) => o(state));
  }

  async function processEvent(e: Event) {
    switch (state.status) {
      case "initial": {
        switch (e.type) {
          case "sid_login":
            if (logInFn) {
              setState(createAuthenticatingState(send, { config: e.config, options: e.options }));
              try {
                const user = await logInFn(e.config, e.options);
                if (onSuccess && user) {
                  onSuccess(user);
                }

                setState(createSuccessState());
              } catch (e) {
                console.error(e);
                setState(createErrorState(send));
              }
            }
        }
        break;
      }

      case "authenticating": {
        switch (e.type) {
          case "sid_retry":
            {
              if (logInFn) {
                try {
                  setState({
                    ...state,
                    context: {
                      ...state.context,
                      attempt: state.context.attempt + 1,
                    },
                  });

                  const user = await logInFn(state.context.config, state.context.options);
                  if (onSuccess && user) {
                    onSuccess(user);
                  }

                  setState(createSuccessState());
                } catch (e) {
                  console.error(e);
                  setState(createErrorState(send));
                }
              }
            }
            break;
          case "sid_cancel":
            {
              setState(createInitialState(send));
            }
            break;
        }
        break;
      }

      case "error": {
        switch (e.type) {
          case "sid_cancel":
            {
              setState(createInitialState(send));
            }
            break;
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
    setLogIn: (fn: LogIn | MFA) => {
      logInFn = fn;
    },
    state,
  };
}

export type Flow = ReturnType<typeof createFlow>;
