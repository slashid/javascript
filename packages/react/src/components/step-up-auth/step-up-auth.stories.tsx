import { Meta, StoryObj } from "@storybook/react";
import { StepUpAuth } from ".";

const meta: Meta<typeof StepUpAuth> = {
  component: StepUpAuth,
};

export default meta;

type Story = StoryObj<typeof StepUpAuth>;

export const Primary: Story = {
  render: () => <StepUpAuth factors={[{ method: "otp_via_sms" }]} />,
};
