import type { Factor } from "@slashid/slashid";
import { Form, ConfigurationProvider } from "@slashid/react";
import styles from "../../styles/Page.module.css";

import "@slashid/react/style.css";

const factors: Factor[] = [{ method: "email_link" }];

export function FormPage() {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div style={{ width: 390 }}>
          <ConfigurationProvider factors={factors}>
            <Form />
          </ConfigurationProvider>
        </div>
      </section>
    </main>
  );
}
