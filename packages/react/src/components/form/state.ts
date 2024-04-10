// CURRENT STATE MACHINE
// initial - get handle, choose factor, submit - transition

// authenticating - POST /id, handle sid events, on success - transition to success, on error - transition to error

// success - final state

// error - final state with retry possibility

// PROPOSED CHANGES (WIP)

// initial - get handle, choose factor, submit - transition

// authenticating.initial - POST /id
// authenticating.handleEvents (optional) handle sid events, on success - transition to success, on error - transition to error

// success - final state

// error - final state with retry possibility

type OTPState = "initial" | "input" | "submitting";

type PasswordState =
  | "initial"
  | "setPassword"
  | "verifyPassword"
  | "recoverPassword"
  | "submitting";

type TOTPState =
  | "initial"
  | "registerAuthenticator"
  | "input"
  | "submitting"
  | "saveRecoveryCodes";

export type AuthenticatingState = OTPState | PasswordState | TOTPState;
