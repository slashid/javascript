import { GDPRConsent } from "@slashid/slashid";
import { CONSENT_LEVELS_WITHOUT_NONE } from "./constants";
import { ActionType, ConsentSettings, ConsentSettingsLevel } from "./types";
import { fromEntries } from "../utils";

export type State = {
  consentSettings: ConsentSettings;
  activeAction: ActionType;
  open: boolean;
  isLoading: boolean;
  hasError: boolean;
  isCustomizing: boolean;
};

type Action =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "START_ACTION"; payload: ActionType }
  | { type: "COMPLETE_ACTION" }
  | { type: "SET_HAS_ERROR"; payload: boolean }
  | { type: "SET_IS_CUSTOMIZING"; payload: boolean }
  | { type: "SYNC_CONSENT_SETTINGS"; payload: GDPRConsent[] }
  | { type: "TOGGLE_CONSENT"; payload: ConsentSettingsLevel };

export type Dispatch = React.Dispatch<Action>;

export const mapConsentsToSettings = (
  consents: GDPRConsent[]
): ConsentSettings =>
  fromEntries(
    CONSENT_LEVELS_WITHOUT_NONE.map<[ConsentSettingsLevel, boolean]>(
      (level) => [
        level,
        consents.map(({ consent_level }) => consent_level).includes(level),
      ]
    )
  );

export const createInitialState = (
  initialConsentSettings: ConsentSettings,
  initialOpen: boolean
): State => ({
  consentSettings: initialConsentSettings,
  activeAction: null,
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
    case "START_ACTION":
      return {
        ...state,
        activeAction: action.payload,
        hasError: false,
        isLoading: true,
      };
    case "COMPLETE_ACTION":
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
    case "SYNC_CONSENT_SETTINGS":
      return {
        ...state,
        consentSettings: mapConsentsToSettings(action.payload),
        open: false,
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
