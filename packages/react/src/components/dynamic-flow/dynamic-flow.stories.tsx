import { Meta, StoryObj } from "@storybook/react";
import { DynamicFlow } from ".";
import { ConfigurationProvider } from "../../context/config-context";
import { defaultOrganization } from "../../middleware";

const meta: Meta<typeof DynamicFlow> = {
  component: DynamicFlow,
};

export default meta;

const rootOid = "b6f94b67-d20f-7fc3-51df-bf6e3b82683e";

type Story = StoryObj<typeof DynamicFlow>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <ConfigurationProvider>
        <DynamicFlow getFactor={() => ({ method: "email_link" })} />
      </ConfigurationProvider>
    </div>
  ),
};

export const WithClassName: Story = {
  name: "With className",
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <ConfigurationProvider>
        <DynamicFlow
          getFactor={() => ({ method: "email_link" })}
          className="my-class"
        />
      </ConfigurationProvider>
    </div>
  ),
};

export const WithSuccessCallback: Story = {
  name: "With success callback",
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <ConfigurationProvider>
        <DynamicFlow
          getFactor={() => ({ method: "email_link" })}
          onSuccess={(user) => {
            console.log("onSuccess - user: ", user);
          }}
        />
      </ConfigurationProvider>
    </div>
  ),
};

export const WithTextOverride: Story = {
  name: "With text override",
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <ConfigurationProvider text={{ "initial.oidc": "Continue with" }}>
        <DynamicFlow getFactor={() => ({ method: "email_link" })} />
      </ConfigurationProvider>
    </div>
  ),
};

export const WithMiddleware: Story = {
  name: "With middleware",
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <ConfigurationProvider>
        <DynamicFlow
          getFactor={() => ({ method: "email_link" })}
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
