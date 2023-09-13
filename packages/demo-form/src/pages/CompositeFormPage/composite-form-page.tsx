import type { Factor } from "@slashid/slashid";
import { Form, Slot, ConfigurationProvider } from "@slashid/react";
import { PageLayout } from "../../components/PageLayout";

import "@slashid/react/style.css";

const factors: Factor[] = [{ method: "email_link" }];

export function CompositeFormPage() {
  return (
    <PageLayout
      title="<Form> - Slots & composition API"
      text="Base Login Form component can be customised by passing in named slots."
      docsUrl="https://developer.slashid.dev/docs/react-sdk/reference/components/react-sdk-reference-form"
    >
      <div style={{ width: 390 }}>
        <h1>Slots</h1>
        <p>
          Layout of the Form can be changed by passing in named slots: footer,
          initial, authenticating, success and error.
        </p>
        <p>
          If you omit a slot, the default component will be used. Once you pass
          in a slot, you are responsible for rendering all the necessary
          components within.
        </p>
        <p>
          In this example we`ll replace the footer slot with a custom component
          and the authentication slot with a custom message.
        </p>
        <ConfigurationProvider factors={factors}>
          <Form>
            <Slot name="authenticating">
              <p>This message appears while authenticating.</p>
            </Slot>
            <Slot name="footer">
              <footer>Custom footer</footer>
            </Slot>
          </Form>
        </ConfigurationProvider>
      </div>
    </PageLayout>
  );
}
