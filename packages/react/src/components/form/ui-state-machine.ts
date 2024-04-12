import type { SlashID } from "@slashid/slashid";
import type { AuthenticatingState, Send } from "./flow.types";
import { isFactorOTP, isFactorPassword } from "../../domain/handles";
import { LogIn, MFA } from "../../domain/types";
import { PasswordState as PasswordStatus } from "./authenticating/password";

type OTPStatus = "initial" | "input" | "submitting";

type PasswordStatus =
  | "initial"
  | "setPassword"
  | "verifyPassword"
  | "recoverPassword"
  | "submitting";

type TOTPStatus =
  | "initial"
  | "registerAuthenticator"
  | "input"
  | "submitting"
  | "saveRecoveryCodes";

export type AuthenticatingUIStatus = OTPStatus | PasswordStatus | TOTPStatus;

export interface IUIStateMachine {
  state: State<AuthenticatingUIStatus>;
  start(): void;
}

export interface State<T> {
  status: T;
  entry?(): void;
  exit?(): void;
}

export interface InputState extends State<AuthenticatingUIStatus> {
  status: "input";
  submit: (...values: unknown[]) => void;
}

type UIStateMachineOpts = {
  send: Send;
  sid: SlashID;
  context: AuthenticatingState["context"];
  logInFn: LogIn | MFA;
};

abstract class UIStateMachine<T extends AuthenticatingUIStatus>
  implements IUIStateMachine
{
  state: State<T>;
  send: Send;
  sid: SlashID;
  context: AuthenticatingState["context"];
  logInFn: LogIn | MFA;

  constructor({ send, sid, context, logInFn }: UIStateMachineOpts) {
    this.send = send;
    this.sid = sid;
    this.state = { status: "NULL_STATUS" as T };
    this.context = context;
    this.logInFn = logInFn;
  }

  start() {
    if (this.state.status === "initial") {
      this.state.entry!();
    }
  }

  protected transition(state: State<T>) {
    if (this.state.exit) {
      this.state.exit();
    }
    this.state = state;
    if (this.state.entry) {
      this.state.entry();
    }

    this.send({ type: "sid_login.state_changed", state });
  }
}

class OTPUIStateMachine extends UIStateMachine<OTPStatus> {
  constructor(opts: UIStateMachineOpts) {
    super(opts);
    this.state = this.prepareNextState("initial");
  }

  private prepareNextState(status: OTPStatus): State<OTPStatus> {
    switch (status) {
      case "initial":
        const otpCodeSentHandler = () => {
          this.transition(this.prepareNextState("input"));
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
          submit: (otp: string) => {
            this.sid.publish("otpCodeSubmitted", otp);
            this.transition(this.prepareNextState("submitting"));
          },
        } as InputState;

      case "submitting":
      default:
        return {
          status,
        };
    }
  }
}

class PasswordUIStateMachine extends UIStateMachine<PasswordStatus> {
  constructor(opts: UIStateMachineOpts) {
    super(opts);
    this.state = this.prepareNextState("initial");
  }

  private prepareNextState(status: OTPStatus): State<PasswordStatus> {
    switch (status) {
      // TODO define all the states and transitions
      case "initial":
        return {
          status,
        };

      default:
        return { status } as State<PasswordStatus>;
    }
  }
}

export function createUIStateMachine(
  opts: UIStateMachineOpts
): IUIStateMachine {
  if (isFactorOTP(opts.context.config.factor)) {
    return new OTPUIStateMachine(opts);
  }

  if (isFactorPassword(opts.context.config.factor)) {
    return new PasswordUIStateMachine(opts);
  }

  // TODO add default one
  return new OTPUIStateMachine(opts);
}

export function isInputState(
  state: State<AuthenticatingUIStatus>
): state is InputState {
  return (
    state.status === "input" &&
    typeof (state as InputState).submit === "function"
  );
}
