import { SlashID } from "@slashid/slashid";
import { AuthenticatingState, Send } from "../flow.types";
import { LogIn, MFA } from "../../../domain/types";

export type DefaultUIStatus = "initial";

export type OTPStatus = "initial" | "input" | "submitting";

export type PasswordStatus =
  | "initial"
  | "setPassword"
  | "verifyPassword"
  | "recoverPassword"
  | "submitting";

export type TOTPStatus =
  | "initial"
  | "registerAuthenticator"
  | "input"
  | "submitting"
  | "saveRecoveryCodes";

export type AuthenticatingUIStatus = OTPStatus | PasswordStatus | TOTPStatus;

export interface IUIStateMachine {
  state: State<AuthenticatingUIStatus>;
}

export interface State<T = AuthenticatingUIStatus> {
  status: T;
  entry?(): void;
  exit?(): void;
}

export interface InputState<T> extends State<T> {
  submit: (...values: string[]) => void;
  error?: string;
}

export interface VerifyPasswordState extends InputState<PasswordStatus> {
  status: "verifyPassword";
  recoverPassword: () => void;
}

export interface RegisterTotpAuthenticatorState extends State<TOTPStatus> {
  status: "registerAuthenticator";
  confirm: () => void;
  qrCode: string;
  uri: string;
}

export interface SaveRecoveryCodesState extends State<TOTPStatus> {
  status: "saveRecoveryCodes";
  recoveryCodes: string[];
  confirm: () => void;
}

export type Recover = () => Promise<void>;

export type UIStateMachineOpts = {
  send: Send;
  sid: SlashID;
  context: AuthenticatingState["context"];
  logInFn: LogIn | MFA;
  recover: Recover;
};

export function isInputState(
  state: State<AuthenticatingUIStatus>
): state is InputState<AuthenticatingUIStatus> {
  return (
    typeof (state as InputState<AuthenticatingUIStatus>).submit === "function"
  );
}

export function isVerifyPasswordState(
  state: State<AuthenticatingUIStatus>
): state is VerifyPasswordState {
  return (
    state.status === "verifyPassword" &&
    typeof (state as VerifyPasswordState).submit === "function" &&
    typeof (state as VerifyPasswordState).recoverPassword === "function"
  );
}

export function isRegisterTotpAuthenticatorState(
  state: State<AuthenticatingUIStatus>
): state is RegisterTotpAuthenticatorState {
  return (
    state.status === "registerAuthenticator" &&
    typeof (state as RegisterTotpAuthenticatorState).confirm === "function" &&
    typeof (state as RegisterTotpAuthenticatorState).qrCode === "string" &&
    typeof (state as RegisterTotpAuthenticatorState).uri === "string"
  );
}

export function isSaveRecoveryCodesState(
  state: State<AuthenticatingUIStatus>
): state is SaveRecoveryCodesState {
  return (
    state.status === "saveRecoveryCodes" &&
    Array.isArray((state as SaveRecoveryCodesState).recoveryCodes) &&
    typeof (state as SaveRecoveryCodesState).confirm === "function"
  );
}
