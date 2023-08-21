import { ConsentSettings, ConsentSettingsLevel } from "./types";

export type State = {
  consentSettings: ConsentSettings;
  open: boolean;
  isLoading: boolean;
  hasError: boolean;
  isCustomizing: boolean;
};

type Action =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "START_LOADING" }
  | { type: "STOP_LOADING" }
  | { type: "SET_HAS_ERROR"; payload: boolean }
  | { type: "SET_IS_CUSTOMIZING"; payload: boolean }
  | { type: "TOGGLE_CONSENT"; payload: ConsentSettingsLevel };

export type Dispatch = React.Dispatch<Action>;

export const createInitialState = (
  initialConsentSettings: ConsentSettings,
  initialOpen: boolean
): State => ({
  consentSettings: initialConsentSettings,
  open: initialOpen,
  isLoading: false,
  hasError: false,
  isCustomizing: false,
});

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_OPEN":
      return {
        ...state,
        open: action.payload,
      };
    case "START_LOADING":
      return {
        ...state,
        hasError: false,
        isLoading: true,
      };
    case "STOP_LOADING":
      return {
        ...state,
        isLoading: false,
      };
    case "SET_HAS_ERROR":
      return {
        ...state,
        hasError: action.payload,
      };
    case "SET_IS_CUSTOMIZING":
      return {
        ...state,
        hasError: false,
        isCustomizing: action.payload,
      };
    case "TOGGLE_CONSENT":
      return {
        ...state,
        consentSettings: {
          ...state.consentSettings,
          [action.payload]: !state.consentSettings[action.payload],
        },
      };
    default:
      return state;
  }
};
