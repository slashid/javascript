import { GDPRConsent, GDPRConsentLevel } from "@slashid/slashid";
import { CONSENT_LEVELS_WITHOUT_NONE } from "./constants";

export type ConsentSettingsLevel = (typeof CONSENT_LEVELS_WITHOUT_NONE)[number];
export type ConsentSettings = Record<ConsentSettingsLevel, boolean>;
export type OnSuccess = (consentLevels: GDPRConsent[]) => void;
export type OnError = (error: unknown) => void;
export type UpdateGdprConsent = (
  consentLevels: GDPRConsentLevel[]
) => Promise<GDPRConsent[]>;

export type GDPRConsentDialogProps = {
  /** Custom class name */
  className?: string;
  /** Custom class name for the trigger button */
  triggerClassName?: string;
  /** Value of the lock on the necessary cookies category */
  necessaryCookiesRequired?: boolean;
  /** Default consent levels to store when clicking on accept all */
  defaultAcceptAllLevels?: ConsentSettingsLevel[];
  /** Default consent levels to store when clicking on reject all */
  defaultRejectAllLevels?: GDPRConsentLevel[];
  /** When this boolean is set to `true`, it disables interactions outside the dialog and prevents the user from closing it until they choose an option */
  forceConsent?: boolean;
  /** When this boolean is set to `true`, it forces the dialog to be open on page load */
  forceOpen?: boolean;
  /** Custom portal container element that the dialog portals into */
  container?: HTMLElement;
  /** Callback when user actions are successful */
  onSuccess?: OnSuccess;
  /** Callback when user actions fail */
  onError?: OnError;
};
