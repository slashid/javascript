import { ConfigurationProvider, GDPRConsentDialog } from "@slashid/react";
import { PageLayout } from "../../components/PageLayout";

import "@slashid/react/style.css";

export function GDPRConsentDialogPage() {
  return (
    <PageLayout
      title="<GDPRConsentDialog>"
      text="GDPR Consent Dialog component to manage the GDPR consent levels for the current user."
      // TODO: add docsUrl
    >
      <ConfigurationProvider>
        <GDPRConsentDialog />
      </ConfigurationProvider>
    </PageLayout>
  );
}
