import type { Factor } from "@slashid/slashid";
import { Form, Slot, ConfigurationProvider } from "@slashid/react";
import { PageLayout } from "../../components/PageLayout";

import "@slashid/react/style.css";
import { Handle } from "@slashid/react/dist/domain/types";
import { useState } from "react";

const factors: Factor[] = [{ method: "email_link" }];

const ComposedForm = ({
  handleSubmit,
}: {
  handleSubmit: (factor: Factor, handle?: Handle | undefined) => void;
}) => {
  const [email, setEmail] = useState("");

  return (
    <form
      data-testid="composed-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(
          { method: "email_link" },
          { type: "email_address", value: email }
        );
      }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <Form.Initial.Controls.Submit />
    </form>
  );
};

export function CompositeFormPage() {
  return (
    <PageLayout
      title="<Form> - Slots & composition API"
      text="Base Login Form component can be customised by passing in named slots."
      docsUrl="https://developer.slashid.dev/docs/react-sdk/reference/components/react-sdk-reference-form"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto",
          gap: "32px",
        }}
      >
        <div style={{ width: 390 }}>
          <h2>Slots</h2>
          <p>
            Layout of the Form can be changed by passing in named slots: footer,
            initial, authenticating, success and error.
          </p>
          <p>
            If you omit a slot, the default component will be used. Once you
            pass in a slot, you are responsible for rendering all the necessary
            components within.
          </p>
          <p>
            In this example we`ll replace the footer slot with a custom
            component and the authentication slot with a custom message.
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
        <div style={{ width: 390 }}>
          <h2>Composition</h2>
          <p>
            Some slots like `initial` have behaviour associated with it. Slots
            themselves are a layout concept, so they don`t have any behaviour
            associated with them. If you want to change the behaviour of the
            form, you can use the composition API.
          </p>
          <p>
            We prepared multiple components you can use out of the box to
            compose the layout you want. The difference between these components
            and the Slots API is that you can freely mix in any kind of
            components you want, they will all be rendered.
          </p>
          <p>
            In this example we`ll replace the `initial` slot with our custom
            implementation that will render our own input field and the existing
            submit button. Additionally we`ll add a custom success message.
          </p>
          <ConfigurationProvider factors={factors}>
            <Form>
              <Slot name="initial">
                <Form.Initial.Controls>
                  {({ handleSubmit }) => {
                    return <ComposedForm handleSubmit={handleSubmit} />;
                  }}
                </Form.Initial.Controls>
              </Slot>
              <Slot name="success">
                <div data-testid="custom-success">Custom success</div>
              </Slot>
            </Form>
          </ConfigurationProvider>
        </div>
      </div>
    </PageLayout>
  );
}
