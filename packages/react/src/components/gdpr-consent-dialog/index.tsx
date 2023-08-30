import { useGDPRConsent } from "../../hooks/use-gdpr-consent";
import { SlashIDLoaded } from "../slashid-loaded";
import { ConsentDialog } from "./consent-dialog";
import { GDPRConsentDialogProps } from "./types";

/**
 * GDPR Consent Dialog component to manage the GDPR consent levels for the current user.
 */
export const GDPRConsentDialog = (props: GDPRConsentDialogProps) => {
  const { consents, isLoading, updateGdprConsent } = useGDPRConsent();

  if (isLoading) {
    return null;
  }

  return (
    <SlashIDLoaded>
      <ConsentDialog
        consents={consents}
        updateGdprConsent={updateGdprConsent}
        {...props}
      />
    </SlashIDLoaded>
  );
};
