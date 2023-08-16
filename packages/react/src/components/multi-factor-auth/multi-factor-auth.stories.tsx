import { Meta, StoryObj } from "@storybook/react";
import { MultiFactorAuth } from ".";

const meta: Meta<typeof MultiFactorAuth> = {
  component: MultiFactorAuth,
};

export default meta;

type Story = StoryObj<typeof MultiFactorAuth>;

export const Default: Story = {
  render: () => (
    <MultiFactorAuth steps={[{ factors: [{ method: "email_link" }] }]} />
  ),
};

export const WithTextOverride: Story = {
  name: "With text override",
  render: () => (
    <MultiFactorAuth
      steps={[
        {
          factors: [{ method: "email_link" }],
          text: {
            "initial.title": "MFA",
          },
        },
      ]}
    />
  ),
};
