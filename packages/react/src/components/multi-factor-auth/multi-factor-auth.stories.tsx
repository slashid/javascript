import { Meta, StoryObj } from "@storybook/react";
import { MultiFactorAuth } from ".";

const meta: Meta<typeof MultiFactorAuth> = {
  component: MultiFactorAuth,
};

export default meta;

type Story = StoryObj<typeof MultiFactorAuth>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <MultiFactorAuth
        steps={[
          { factors: [{ method: "email_link" }] },
          {
            factors: [{ method: "otp_via_sms" }],
          },
        ]}
      />
    </div>
  ),
};

export const WithTextOverride: Story = {
  name: "With text override",
  render: () => (
    <div style={{ maxWidth: 450, margin: "auto" }}>
      <MultiFactorAuth
        steps={[
          { factors: [{ method: "email_link" }] },
          {
            factors: [{ method: "otp_via_sms" }],
            text: {
              "initial.title": "MFA",
            },
          },
        ]}
      />
    </div>
  ),
};
