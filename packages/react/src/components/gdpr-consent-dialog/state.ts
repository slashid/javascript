import { GDPRConsent } from "@slashid/slashid";
import { CONSENT_LEVELS_WITHOUT_NONE } from "./constants";
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
  | { type: "SET_CONSENT_SETTINGS"; payload: GDPRConsent[] }
  | { type: "TOGGLE_CONSENT"; payload: ConsentSettingsLevel };

export type Dispatch = React.Dispatch<Action>;

export const mapConsentsToSettings = (consents: GDPRConsent[]) => {
  const settings = Object.fromEntries(
    CONSENT_LEVELS_WITHOUT_NONE.map((level) => [
      level,
      consents.map(({ consent_level }) => consent_level).includes(level),
    ])
  );
  return settings as ConsentSettings;
};

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
    case "SET_CONSENT_SETTINGS":
      return {
        ...state,
        consentSettings: mapConsentsToSettings(action.payload),
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
