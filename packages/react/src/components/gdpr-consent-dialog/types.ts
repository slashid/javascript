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
  /** Default open state */
  defaultOpen?: boolean;
  /** Value of the lock on the necessary cookies category */
  necessaryCookiesRequired?: boolean;
  /** Default consent levels to store when clicking on accept all */
  defaultAcceptAllLevels?: ConsentSettingsLevel[];
  /** Default consent levels to store when clicking on reject all */
  defaultRejectAllLevels?: GDPRConsentLevel[];
  /** Callback when user actions are successful */
  onSuccess?: OnSuccess;
  /** Callback when user actions fail */
  onError?: OnError;
  /**
   * The modality of the dialog.
   * When set to `true`, interaction with outside elements will be disabled and only dialog content will be visible to screen readers.
   * When set to `false`, interaction with outside elements will be enabled and all content will be visible to screen readers.
   */
  modal?: boolean;
};
