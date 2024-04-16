import type { SlashID } from "@slashid/slashid";
import type {
  AuthenticatingState,
  Send,
  Event as FlowEvent,
} from "./flow.types";
import { isFactorOTP, isFactorPassword } from "../../domain/handles";
import { LogIn, MFA } from "../../domain/types";

type DefaultUIStatus = "initial";

type OTPStatus = "initial" | "input" | "submitting";

export type PasswordStatus =
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
}

export interface State<T> {
  status: T;
  entry?(): void;
  exit?(): void;
}

export interface InputState<T> extends State<T> {
  submit: (...values: unknown[]) => void;
}

export interface VerifyPasswordState extends InputState<PasswordStatus> {
  status: "verifyPassword";
  recoverPassword: () => void;
}

type Recover = () => Promise<void>;

type UIStateMachineOpts = {
  send: Send;
  sid: SlashID;
  context: AuthenticatingState["context"];
  logInFn: LogIn | MFA;
  recover: Recover;
};

abstract class UIStateMachine<T extends AuthenticatingUIStatus>
  implements IUIStateMachine
{
  public state: State<T>;
  private _send: Send;
  protected sid: SlashID;
  protected context: AuthenticatingState["context"];
  protected logInFn: LogIn | MFA;
  protected recover: Recover;

  constructor(
    { send, sid, context, logInFn, recover }: UIStateMachineOpts,
    initialState: State<T>
  ) {
    this._send = send;
    this.sid = sid;
    this.state = initialState;
    this.context = context;
    this.logInFn = logInFn;
    this.recover = recover;
  }

  protected transition(state: State<T>) {
    if (this.state.exit) {
      this.state.exit();
    }
    this.state = state;
    if (this.state.entry) {
      this.state.entry();
    }

    this.send({ type: "sid_login.ui_state_changed", state });
  }

  protected send(e: Event) {
    this._send(e as FlowEvent);
  }
}

type UIEvent =
  | {
      type: "sid_ui.otpCodeSent";
    }
  | {
      type: "sid_ui.otpCodeSubmitted";
    }
  | {
      type: "sid_ui.passwordSetReady";
    }
  | {
      type: "sid_ui.passwordVerifyReady";
    }
  | {
      type: "sid_ui.passwordRecoveryRequested";
    }
  | {
      type: "sid_ui.passwordSubmitted";
    }
  | {
      type: "sid_ui.passwordRecovered";
    };

type Event = FlowEvent | UIEvent;

class OTPUIStateMachine extends UIStateMachine<OTPStatus> {
  constructor(opts: UIStateMachineOpts) {
    const otpCodeSentHandler = () => {
      this.send({ type: "sid_ui.otpCodeSent" });
    };

    super(opts, {
      status: "initial",
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
    });
  }

  send(e: Event) {
    switch (e.type) {
      case "sid_ui.otpCodeSent":
        this.transition({
          status: "input",
          submit: (otp: string) => {
            this.sid.publish("otpCodeSubmitted", otp);
            this.send({ type: "sid_ui.otpCodeSubmitted" });
          },
        } as InputState<OTPStatus>);
        break;

      case "sid_ui.otpCodeSubmitted":
        this.transition({
          status: "submitting",
        });
        break;

      default:
        super.send(e);
    }
  }
}

class PasswordUIStateMachine extends UIStateMachine<PasswordStatus> {
  constructor(opts: UIStateMachineOpts) {
    const onSetPassword = () => {
      this.send({ type: "sid_ui.passwordSetReady" });
    };

    const onVerifyPassword = () => {
      this.send({ type: "sid_ui.passwordVerifyReady" });
    };

    super(opts, {
      status: "initial",
      entry: () => {
        this.sid.subscribe("passwordSetReady", onSetPassword);
        this.sid.subscribe("passwordVerifyReady", onVerifyPassword);

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
        this.sid.unsubscribe("passwordSetReady", onSetPassword);
        this.sid.unsubscribe("passwordVerifyReady", onVerifyPassword);
      },
    });
  }
  send(e: Event) {
    switch ((e as UIEvent).type) {
      case "sid_ui.passwordSetReady":
        this.transition({
          status: "setPassword",
          submit: (password: string) => {
            this.sid.publish("passwordSubmitted", password);
            this.send({ type: "sid_ui.passwordSubmitted" });
          },
        } as InputState<PasswordStatus>);
        break;

      case "sid_ui.passwordVerifyReady":
      case "sid_ui.passwordRecovered":
        this.transition({
          status: "verifyPassword",
          submit: (password: string) => {
            this.sid.publish("passwordSubmitted", password);
            this.send({ type: "sid_ui.passwordSubmitted" });
          },
          recoverPassword: () => {
            this.send({ type: "sid_ui.passwordRecoveryRequested" });
          },
        } as VerifyPasswordState);
        break;

      case "sid_ui.passwordRecoveryRequested":
        this.transition({
          status: "recoverPassword",
          entry: async () => {
            try {
              await this.recover();
              this.send({ type: "sid_ui.passwordRecovered" });
            } catch (e) {
              // ignored
            }
          },
        });
        break;

      case "sid_ui.passwordSubmitted":
        this.transition({
          status: "submitting",
        });
        break;

      default:
        super.send(e);
    }
  }
}

class DefaultUIStateMachine extends UIStateMachine<DefaultUIStatus> {
  constructor(opts: UIStateMachineOpts) {
    super(opts, {
      status: "initial",
      entry: () => {
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
    });
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

  return new DefaultUIStateMachine(opts);
}

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