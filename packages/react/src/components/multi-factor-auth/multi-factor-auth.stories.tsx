import { Meta, StoryObj } from "@storybook/react";
import { MultiFactorAuth } from ".";

const meta: Meta<typeof MultiFactorAuth> = {
  component: MultiFactorAuth,
};

export default meta;

type Story = StoryObj<typeof MultiFactorAuth>;

export const Primary: Story = {
  render: () => (
    <MultiFactorAuth
      steps={[
        { factors: [{ method: "email_link" }] },
        {
          factors: [{ method: "otp_via_sms" }],
        },
      ]}
    />
  ),
};
