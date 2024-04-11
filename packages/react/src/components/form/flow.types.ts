import type { User } from "@slashid/slashid";
import {
  Cancel,
  LoginConfiguration,
  Retry,
  LoginOptions,
} from "../../domain/types";

export interface AuthenticatingState {
  status: "authenticating";
  context: {
    config: LoginConfiguration;
    options?: LoginOptions;
    attempt: number;
  };
  // uiStateMachine? => uiStateMachineFactory(factor) => OTP | TOTP | Password
  retry: Retry;
  cancel: Cancel;
  recover: () => void;
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

export interface State<T> {
  status: T;
  entry?(): void;
  exit?(): void;
}

interface LoginStateChangedEvent {
  type: "sid_login.state_changed";
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
  | LoginStateChangedEvent
  | LoginSuccessEvent
  | LoginErrorEvent
  | RetryEvent
  | CancelEvent
  | UpdateContextEvent;

export type FlowActions = {
  // a function that will be called when the state is entered
  entry?: () => void;
};

export type FlowState = FlowActions &
  (InitialState | AuthenticatingState | SuccessState | ErrorState);

export type Observer = (state: FlowState, event: Event) => void;
export type Send = (e: Event) => void;
