import { GDPRConsent } from "@slashid/slashid";

export const CONSENT_LEVELS_WITHOUT_NONE = [
  "necessary",
  "analytics",
  "marketing",
  "retargeting",
  "tracking",
] as const;

export type ConsentSettingsLevel = (typeof CONSENT_LEVELS_WITHOUT_NONE)[number];
export type ConsentSettings = Record<ConsentSettingsLevel, boolean>;

export type State = {
  consentSettings: ConsentSettings;
  open: boolean;
  isLoading: boolean;
  hasError: boolean;
  isCustomizing: boolean;
};

type Action =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_CONSENT_SETTINGS"; payload: GDPRConsent[] }
  | { type: "START_LOADING" }
  | { type: "STOP_LOADING" }
  | { type: "SET_HAS_ERROR"; payload: boolean }
  | { type: "SET_IS_CUSTOMIZING"; payload: boolean }
  | { type: "TOGGLE_CONSENT"; payload: ConsentSettingsLevel };

export type Dispatch = React.Dispatch<Action>;

const getConsentSettings = (consents: GDPRConsent[]) => {
  const consentSettings = Object.fromEntries(
    CONSENT_LEVELS_WITHOUT_NONE.map((level) => [
      level,
      consents.map((c) => c.consent_level).includes(level),
    ])
  );
  return consentSettings as ConsentSettings;
};

export const createInitialState = (
  consents: GDPRConsent[],
  defaultOpen: boolean
): State => ({
  consentSettings: getConsentSettings(consents),
  open: defaultOpen,
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
    case "SET_CONSENT_SETTINGS":
      return {
        ...state,
        consentSettings: getConsentSettings(action.payload),
        open: !action.payload.length,
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
