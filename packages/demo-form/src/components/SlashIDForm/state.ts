import { Factor, FactorMethod } from "@slashid/slashid";
import { email, phoneNumber } from "../../helpers/validation";

export type HandleType = "email_address" | "phone_number";
export type AuthMethod = FactorMethod;

export interface FormState {
  status: "INITIAL" | "AUTHENTICATING" | "AUTH_SUCCESS" | "AUTH_FAILURE";
  canSubmit: boolean;
  handleType: HandleType;
  handleValue: string;
  authMethod: AuthMethod | undefined;
  authOptions: undefined | Factor["options"];
}

export const initialState: FormState = {
  status: "INITIAL",
  canSubmit: true,
  handleType: "email_address",
  handleValue: "",
  authMethod: undefined,
  authOptions: undefined,
};

export type Action =
  | SetIdentifierAction
  | SetHandleAction
  | SetAuthMethodAction
  | StartAuthAction
  | RestartAuthAction
  | CompleteAuthAction
  | FailAuthAction;

export interface SetIdentifierAction {
  type: "SET_HANDLE_TYPE";
  payload: HandleType;
}

export interface SetHandleAction {
  type: "SET_HANDLE";
  payload: string;
}

export interface SetAuthMethodAction {
  type: "SET_AUTH_METHOD";
  payload: AuthMethod;
}

export interface StartAuthAction {
  type: "START_AUTH";
}

export interface RestartAuthAction {
  type: "RESTART_AUTH";
}

export interface CompleteAuthAction {
  type: "COMPLETE_AUTH";
}

export interface FailAuthAction {
  type: "FAIL_AUTH";
}

function validate(state: FormState): boolean {
  const { handleValue, handleType } = state;

  if (!handleValue) {
    return false;
  }

  if (handleType === "email_address") {
    return email(handleValue);
  }

  if (handleType === "phone_number") {
    return phoneNumber(handleValue);
  }

  return false;
}

function createOptions(method: FactorMethod): Factor["options"] {
  // TODO figure out the platform vs cross-platform attachment
  switch (method) {
    case "oidc": {
      return {
        client_id:
          "519241041566-gn4khi1cb57djuidqrie5lu3bprdcfgn.apps.googleusercontent.com",
        // @ts-expect-error TODO enums are terrible here
        provider: "google",
        // @ts-expect-error TODO enums again
        ux_mode: "popup",
      };
    }
    case "webauthn": {
      return {
        // @ts-expect-error TODO enums again
        attachment: "platform",
      };
    }
    default:
      return undefined;
  }
}

export function reducer(state: FormState, action: Action): FormState {
  console.log({ state, action });

  switch (state.status) {
    case "INITIAL":
      switch (action.type) {
        case "SET_HANDLE_TYPE":
          return {
            ...state,
            handleType: action.payload,
            handleValue: "",
          };
        case "SET_HANDLE": {
          const nextState = {
            ...state,
            handleValue: action.payload,
          };
          return {
            ...nextState,
            canSubmit: validate(nextState),
          };
        }
        case "SET_AUTH_METHOD":
          return {
            ...state,
            authMethod: action.payload,
            authOptions: createOptions(action.payload),
          };
        case "START_AUTH":
          if (state.canSubmit) {
            return { ...state, status: "AUTHENTICATING" };
          } else return state;
        default:
          return state;
      }

    case "AUTHENTICATING": {
      switch (action.type) {
        case "RESTART_AUTH":
          return { ...state, status: "AUTHENTICATING" };
        case "COMPLETE_AUTH":
          return { ...state, status: "AUTH_SUCCESS" };
        case "FAIL_AUTH":
          return { ...state, status: "AUTH_FAILURE" };
        default:
          return state;
      }
    }

    default:
      return state;
  }
}
