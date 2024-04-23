import type { SlashID, TotpKeyGenerated, User } from "@slashid/slashid";
import type {
  AuthenticatingState,
  Send,
  Event as FlowEvent,
} from "../flow.types";
import {
  isFactorOTP,
  isFactorPassword,
  isFactorTOTP,
} from "../../../domain/handles";
import { LogIn, MFA } from "../../../domain/types";
import {
  AuthenticatingUIStatus,
  DefaultUIStatus,
  IUIStateMachine,
  InputState,
  OTPStatus,
  PasswordStatus,
  RegisterTotpAuthenticatorState,
  SaveRecoveryCodesState,
  State,
  TOTPStatus,
  UIStateMachineOpts,
  VerifyPasswordState,
  Recover,
} from "./ui-state-machine.types";

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
    }
  | {
      type: "sid_ui.totpKeyGenerated";
      qrCode: string;
      uri: string;
    }
  | {
      type: "sid_ui.totpCodeRequested";
    }
  | {
      type: "sid_ui.totpAuthenticatorRegisterConfirmed";
    }
  | {
      type: "sid_ui.userAuthenticated";
      user: User;
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
            if (!user) {
              this.send({
                type: "sid_login.error",
                error: new Error("User not returned from /id"),
              });

              return;
            }

            this.send({ type: "sid_login.success", user });
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

  protected send(e: Event) {
    switch (e.type) {
      case "sid_ui.otpCodeSent":
        this.transition(
          createInputState("input", (otp) => {
            this.sid.publish("otpCodeSubmitted", otp);
            this.send({ type: "sid_ui.otpCodeSubmitted" });
          })
        );
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
            if (!user) {
              this.send({
                type: "sid_login.error",
                error: new Error("User not returned from /id"),
              });

              return;
            }

            this.send({ type: "sid_login.success", user });
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
  protected send(e: Event) {
    switch ((e as UIEvent).type) {
      case "sid_ui.passwordSetReady":
        this.transition(
          createInputState("setPassword", (password) => {
            this.sid.publish("passwordSubmitted", password);
            this.send({ type: "sid_ui.passwordSubmitted" });
          })
        );
        break;

      case "sid_ui.passwordVerifyReady":
      case "sid_ui.passwordRecovered":
        this.transition(
          createVerifyPasswordState(
            (password) => {
              this.sid.publish("passwordSubmitted", password);
              this.send({ type: "sid_ui.passwordSubmitted" });
            },
            () => {
              this.send({ type: "sid_ui.passwordRecoveryRequested" });
            }
          )
        );

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

class TOTPUIStateMachine extends UIStateMachine<TOTPStatus> {
  private recoveryCodes: string[] | null;
  private isRegisterFlow: boolean;

  constructor(opts: UIStateMachineOpts) {
    const totpKeyGeneratedHandler = ({
      qrCode,
      recoveryCodes,
      uri,
    }: TotpKeyGenerated) => {
      this.recoveryCodes = recoveryCodes;
      this.isRegisterFlow = true;

      this.send({
        type: "sid_ui.totpKeyGenerated",
        qrCode,
        uri,
      });
    };
    const totpCodeRequestedHandler = () => {
      this.send({ type: "sid_ui.totpCodeRequested" });
    };

    super(opts, {
      status: "initial",
      entry: () => {
        this.sid.subscribe("totpKeyGenerated", totpKeyGeneratedHandler);
        this.sid.subscribe("totpCodeRequested", totpCodeRequestedHandler);

        this.logInFn(this.context.config, this.context.options)
          .then((user) => {
            if (!user) {
              this.send({
                type: "sid_login.error",
                error: new Error("User not returned from /id"),
              });

              return;
            }

            if (this.isRegisterFlow) {
              this.send({ type: "sid_ui.userAuthenticated", user });
            } else {
              this.send({ type: "sid_login.success", user });
            }
          })
          .catch((error) => {
            this.send({ type: "sid_login.error", error });
          });
      },
      exit: () => {
        this.sid.unsubscribe("totpKeyGenerated", totpKeyGeneratedHandler);
        this.sid.unsubscribe("totpCodeRequested", totpCodeRequestedHandler);
      },
    });

    this.recoveryCodes = null;
    this.isRegisterFlow = false;
  }

  protected send(e: Event): void {
    switch (e.type) {
      case "sid_ui.totpKeyGenerated":
        this.transition(
          createRegisterTotpAuthenticatorState({
            qrCode: e.qrCode,
            uri: e.uri,
            confirm: () => {
              this.send({ type: "sid_ui.totpAuthenticatorRegisterConfirmed" });
            },
          })
        );
        break;

      case "sid_ui.totpCodeRequested":
      case "sid_ui.totpAuthenticatorRegisterConfirmed":
        this.transition(
          createInputState("input", (totp: string) => {
            this.sid.publish("otpCodeSubmitted", totp);
            this.send({ type: "sid_ui.otpCodeSubmitted" });
          })
        );
        break;

      case "sid_ui.otpCodeSubmitted":
        this.transition({ status: "submitting" });
        break;

      case "sid_ui.userAuthenticated":
        if (!Array.isArray(this.recoveryCodes)) return;

        this.transition(
          createSaveRecoveryCodesState({
            recoveryCodes: this.recoveryCodes,
            confirm: () => {
              this.send({ type: "sid_login.success", user: e.user });
            },
          })
        );
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
            if (!user) {
              this.send({
                type: "sid_login.error",
                error: new Error("User not returned from /id"),
              });

              return;
            }

            this.send({ type: "sid_login.success", user });
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

  if (isFactorTOTP(opts.context.config.factor)) {
    return new TOTPUIStateMachine(opts);
  }

  return new DefaultUIStateMachine(opts);
}

function createInputState<T = AuthenticatingUIStatus>(
  status: T,
  submit: (...values: string[]) => void
): InputState<T> {
  return {
    status,
    submit,
  };
}

function createVerifyPasswordState(
  submit: (...values: string[]) => void,
  recoverPassword: () => void
): VerifyPasswordState {
  return {
    status: "verifyPassword",
    submit,
    recoverPassword,
  };
}

function createRegisterTotpAuthenticatorState({
  confirm,
  qrCode,
  uri,
}: Omit<
  RegisterTotpAuthenticatorState,
  "status"
>): RegisterTotpAuthenticatorState {
  return {
    status: "registerAuthenticator",
    qrCode,
    uri,
    confirm,
  };
}

function createSaveRecoveryCodesState({
  recoveryCodes,
  confirm,
}: Omit<SaveRecoveryCodesState, "status">): SaveRecoveryCodesState {
  return {
    status: "saveRecoveryCodes",
    recoveryCodes,
    confirm,
  };
}
