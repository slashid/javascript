import type { Factor } from "@slashid/slashid";
import {
  StepUpAuth,
  ConfigurationProvider,
  Form,
  LoggedOut,
} from "@slashid/react";
import styles from "../../styles/Page.module.css";

import "@slashid/react/style.css";

const firstStepFactors: Factor[] = [{ method: "email_link" }];
const secondStepFactors: Factor[] = [{ method: "sms_link" }];

export function StepUpAuthPage() {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div style={{ width: 390 }}>
          <ConfigurationProvider factors={firstStepFactors}>
            <LoggedOut>
              <Form />
            </LoggedOut>
            <StepUpAuth factors={secondStepFactors} />
          </ConfigurationProvider>
        </div>
      </section>
    </main>
  );
}
