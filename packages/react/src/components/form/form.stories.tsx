import { Meta, StoryObj } from "@storybook/react";
import { Form } from ".";
import { ConfigurationProvider } from "../../context/config-context";
import { defaultOrganization } from "../../middleware";

const meta: Meta<typeof Form> = {
  component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

const rootOid = "b6f94b67-d20f-7fc3-51df-bf6e3b82683e";

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <ConfigurationProvider>
        <Form />
      </ConfigurationProvider>
    </div>
  ),
};

export const WithSuccessCallback: Story = {
  name: "With success callback",
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <ConfigurationProvider>
        <Form
          onSuccess={(user) => {
            console.log("onSuccess - user: ", user);
          }}
        />
      </ConfigurationProvider>
    </div>
  ),
};

export const WithCustomFactors: Story = {
  name: "With custom factors",
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <ConfigurationProvider>
        <Form factors={[{ method: "email_link" }, { method: "otp_via_sms" }]} />
      </ConfigurationProvider>
    </div>
  ),
};

export const WithTextOverride: Story = {
  name: "With text override",
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <ConfigurationProvider>
        <Form text={{ "initial.title": "Authentication" }} />
      </ConfigurationProvider>
    </div>
  ),
};

export const WithMiddleware: Story = {
  name: "With middleware",
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
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
    </div>
  ),
};
