import type { Factor } from "@slashid/slashid";
import {
  StepUpAuth,
  ConfigurationProvider,
  Form,
  LoggedOut,
} from "@slashid/react";
import { PageLayout } from "../../components/PageLayout";

import "@slashid/react/style.css";

const firstStepFactors: Factor[] = [{ method: "email_link" }];
const secondStepFactors: Factor[] = [{ method: "sms_link" }];

export function StepUpAuthPage() {
  return (
    <PageLayout
      title="<StepUpAuth>"
      text="This component implements Step-Up Authentication flow - you can request already authenticated users to reauthenticate before proceeding."
    >
      <div style={{ width: 390 }}>
        <ConfigurationProvider factors={firstStepFactors}>
          <LoggedOut>
            <Form />
          </LoggedOut>
          <StepUpAuth factors={secondStepFactors} />
        </ConfigurationProvider>
      </div>
    </PageLayout>
  );
}
