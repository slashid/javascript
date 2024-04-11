import type { Factor, SlashID } from "@slashid/slashid";
import type { AuthenticatingState, Send } from "./flow.types";
import { isFactorOTP } from "../../domain/handles";
import { LogIn, MFA } from "../../domain/types";
// CURRENT STATE MACHINE
// initial - get handle, choose factor, submit - transition

// authenticating - POST /id, handle sid events, on success - transition to success, on error - transition to error

// success - final state

// error - final state with retry possibility

// PROPOSED CHANGES (WIP)

// initial - get handle, choose factor, submit - transition

// authenticating
// |
// - registerListeners
// - login
// -
// - registerListeners

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

export type AuthenticatingUIState = OTPState | PasswordState | TOTPState;

type UIStateMachineFactoryOptions = {
  factor: Factor;
  send: Send;
  sid: SlashID;
  context: AuthenticatingState["context"];
  logInFn: LogIn | MFA;
};

export interface UIStateMachine {
  state: State<AuthenticatingUIState>;
  start(): void;
}

export interface State<T> {
  status: T;
  entry?(): void;
  exit?(): void;
}

class OTPUIStateMachine implements UIStateMachine {
  state: State<OTPState>;
  send: Send;
  sid: SlashID;
  context: AuthenticatingState["context"];
  logInFn: LogIn | MFA;

  constructor(
    send: Send,
    sid: SlashID,
    context: AuthenticatingState["context"],
    logInFn: LogIn | MFA
  ) {
    this.send = send;
    this.sid = sid;
    this.state = this.prepareNexState("initial");
    this.context = context;
    this.logInFn = logInFn;
  }

  start() {
    if (this.state.status === "initial") {
      this.state.entry!();
    }
  }

  transition(state: State<OTPState>) {
    console.log("transition from: ", this.state.status, " to: ", state.status);
    if (this.state.exit) {
      this.state.exit();
    }
    this.state = state;
    if (this.state.entry) {
      this.state.entry();
    }

    this.send({ type: "sid_login.state_changed", state });
  }

  private prepareNexState(status: OTPState): State<OTPState> {
    switch (status) {
      case "initial":
        const otpCodeSentHandler = () => {
          this.transition(this.prepareNexState("input"));
        };

        return {
          status,
          entry: () => {
            this.sid.subscribe("otpCodeSent", otpCodeSentHandler);

            this.logInFn(this.context.config, this.context.options)
              .then((user) => {
                if (user) {
                  this.send({ type: "sid_login.success", user });
                } else {
                  this.send({
                    type: "sid_login.error",
                    error: new Error("User not returned from /id"),
                  });
                }
              })
              .catch((error) => {
                this.send({ type: "sid_login.error", error });
              });
          },
          exit: () => {
            this.sid.unsubscribe("otpCodeSent", otpCodeSentHandler);
          },
        };

      case "input":
        return {
          status,
        };

        break;
      case "submitting":
        return {
          status,
        };
    }
  }
}

export function createUIStateMachine(
  opts: UIStateMachineFactoryOptions
): UIStateMachine {
  if (isFactorOTP(opts.factor)) {
    return new OTPUIStateMachine(
      opts.send,
      opts.sid,
      opts.context,
      opts.logInFn
    );
  }

  // TODO add default one
  return new OTPUIStateMachine(opts.send, opts.sid, opts.context, opts.logInFn);
}
