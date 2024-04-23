import type { Factor } from "@slashid/slashid";
import {
  Form,
  ConfigurationProvider,
  LoggedIn,
  useSlashID,
} from "@slashid/react";
import { PageLayout } from "../../components/PageLayout";

import "@slashid/react/style.css";

const factors: Factor[] = [
  { method: "email_link" },
  { method: "otp_via_email" },
  { method: "password" },
];

export function FormPage() {
  const { logOut } = useSlashID();
  return (
    <PageLayout
      title="<Form>"
      text="Base Login Form component used with <ConfigurationProvider>. You can use it to authenticate with first factor."
      docsUrl="https://developer.slashid.dev/docs/react-sdk/reference/components/react-sdk-reference-form"
    >
      <div style={{ width: 390 }}>
        <ConfigurationProvider factors={factors}>
          <Form />
        </ConfigurationProvider>
        <LoggedIn>
          <button data-testid="logout-btn" onClick={logOut}>
            Log out
          </button>
        </LoggedIn>
      </div>
    </PageLayout>
  );
}
