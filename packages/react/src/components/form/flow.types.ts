import type { User } from "@slashid/slashid";
import {
  Cancel,
  LoginConfiguration,
  Retry,
  LoginOptions,
} from "../../domain/types";
import type { State } from "./state/ui-state-machine.types";

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
  entry: () => void;
  matches: (pattern: string) => boolean;
  getChildState: () => State;
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

export type FlowActions = {
  // a function that will be called when the state is entered
  entry?: () => void;
};

export type FlowState = FlowActions &
  (InitialState | AuthenticatingState | SuccessState | ErrorState);

export type Observer = (state: FlowState, event: Event) => void;
export type Send = (e: Event) => void;

interface LoginUIStateChangedEvent {
  type: "sid_login.ui_state_changed";
  state: State<unknown>;
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

interface UpdateContextEvent {
  type: "sid_update_context";
}

export type Event =
  | InitEvent
  | LoginEvent
  | LoginUIStateChangedEvent
  | LoginSuccessEvent
  | LoginErrorEvent
  | RetryEvent
  | CancelEvent
  | UpdateContextEvent;

export type CreateFlowOptions = {
  onSuccess?: (user: User) => void;
  onError?: (error: Error, context: ErrorState["context"]) => void;
};

export type HistoryEntry = {
  state: FlowState;
  event: Event;
};
