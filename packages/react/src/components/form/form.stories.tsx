import { Meta, StoryObj } from "@storybook/react";
import { Form } from ".";
import { ConfigurationProvider } from "../../context/config-context";
import { defaultOrganization } from "../../middleware";
import { Slot } from "../slot";
import { Factor } from "@slashid/slashid";
import { useState } from "react";
import { Handle } from "../../domain/types";

const meta: Meta<typeof Form> = {
  component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

const rootOid = "b6f94b67-d20f-7fc3-51df-bf6e3b82683e";

export const Default: Story = {
  render: () => (
    <ConfigurationProvider>
      <Form />
    </ConfigurationProvider>
  ),
};

export const WithSuccessCallback: Story = {
  name: "With success callback",
  render: () => (
    <ConfigurationProvider>
      <Form
        onSuccess={(user) => {
          console.log("onSuccess - user: ", user);
        }}
      />
    </ConfigurationProvider>
  ),
};

export const WithCustomFactors: Story = {
  name: "With custom factors",
  render: () => (
    <ConfigurationProvider>
      <Form factors={[{ method: "email_link" }, { method: "otp_via_sms" }]} />
    </ConfigurationProvider>
  ),
};

export const WithTextOverride: Story = {
  name: "With text override",
  render: () => (
    <ConfigurationProvider>
      <Form text={{ "initial.title": "Authentication" }} />
    </ConfigurationProvider>
  ),
};

export const WithMiddleware: Story = {
  name: "With middleware",
  render: () => (
    <ConfigurationProvider>
      <Form
        middleware={[
          defaultOrganization(({ organizations }) => {
            const preferred = organizations.find(
              (org) => org.org_name === "MyOrg/abc2"
            );
            if (preferred) return preferred.id;

            return rootOid;
          }),
        ]}
      />
    </ConfigurationProvider>
  ),
};

export const WithSlots: Story = {
  name: "With Slots API",
  render: () => (
    <ConfigurationProvider>
      <p>Using layout slots to customise the form</p>
      <Form>
        <Slot name="footer">
          <footer>Custom footer</footer>
        </Slot>
      </Form>
    </ConfigurationProvider>
  ),
};

export const WithComposition: Story = {
  name: "With Slots API and composition",
  render: () => (
    <ConfigurationProvider>
      <p>
        Using the initial slot to customise the form layout using the building
        blocks we provide
      </p>
      <Form>
        <Slot name="initial">
          <Form.Initial.Logo />
          <Form.Initial.Header />
          <p>Components can be added anywhere to the initial slot</p>
          <Form.Initial.Controls>
            <Form.Initial.Controls.Input />
            <div data-testid="custom-text-controls">
              Arbitrary components can within the form controls
            </div>
            <Form.Initial.Controls.Submit />
          </Form.Initial.Controls>
        </Slot>
      </Form>
    </ConfigurationProvider>
  ),
};

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

export const WithCompositionAndCustomisation: Story = {
  name: "With custom building blocks",
  render: () => (
    <ConfigurationProvider>
      <p>Replacing the form building blocks with custom components</p>
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
  ),
};
