import type { Factor } from "@slashid/slashid";
import { Form, ConfigurationProvider } from "@slashid/react";
import { PageLayout } from "../../components/PageLayout";

import "@slashid/react/style.css";

const factors: Factor[] = [{ method: "email_link" }];

export function FormPage() {
  return (
    <PageLayout
      title="<Form>"
      text="Base Login Form component used with <ConfigurationProvider>. You can use it to authenticate with first factor."
      docsUrl="https://developer.slashid.dev/docs/react-sdk/reference/react-sdk-reference-form"
    >
      <div style={{ width: 390 }}>
        <ConfigurationProvider factors={factors}>
          <Form />
        </ConfigurationProvider>
      </div>
    </PageLayout>
  );
}
