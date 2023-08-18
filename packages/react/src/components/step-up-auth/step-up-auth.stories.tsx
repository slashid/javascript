import { Meta, StoryObj } from "@storybook/react";
import { StepUpAuth } from ".";

const meta: Meta<typeof StepUpAuth> = {
  component: StepUpAuth,
};

export default meta;

type Story = StoryObj<typeof StepUpAuth>;

export const Default: Story = {
  render: () => <StepUpAuth />,
};

export const WithCustomFactors: Story = {
  name: "With custom factors",
  render: () => <StepUpAuth factors={[{ method: "otp_via_sms" }]} />,
};

export const WithTextOverride: Story = {
  name: "With text override",
  render: () => <StepUpAuth text={{ "initial.title": "Step-Up Auth" }} />,
};
