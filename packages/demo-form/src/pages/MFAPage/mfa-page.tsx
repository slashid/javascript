import type { Factor } from "@slashid/slashid";
import { MultiFactorAuth, ConfigurationProvider } from "@slashid/react";
import styles from "../../styles/Page.module.css";

import "@slashid/react/style.css";

const firstStepFactors: Factor[] = [{ method: "email_link" }];
const secondStepFactors: Factor[] = [{ method: "sms_link" }];

export function MFAPage() {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div style={{ width: 390 }}>
          <ConfigurationProvider factors={firstStepFactors}>
            <MultiFactorAuth factors={secondStepFactors} />
          </ConfigurationProvider>
        </div>
      </section>
    </main>
  );
}
