import type { Factor } from "@slashid/slashid";
import { MultiFactorAuth } from "@slashid/react";
import { PageLayout } from "../../components/PageLayout";

import "@slashid/react/style.css";

const firstStepFactors: Factor[] = [{ method: "email_link" }];
const secondStepFactors: Factor[] = [{ method: "sms_link" }];

export function MFAPage() {
  return (
    <PageLayout
      title="<MultiFactorAuth>"
      text="Component used for Multi-Factor Authentication - you can configure the number sequence of authentication steps."
    >
      <div style={{ width: 390 }}>
        <MultiFactorAuth
          steps={[
            { factors: firstStepFactors },
            { factors: secondStepFactors },
          ]}
        />
      </div>
    </PageLayout>
  );
}
