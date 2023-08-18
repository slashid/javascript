import { Meta, StoryObj } from "@storybook/react";
import { LoggedIn } from ".";

const meta: Meta<typeof LoggedIn> = {
  component: LoggedIn,
};

export default meta;

type Story = StoryObj<typeof LoggedIn>;

export const Default: Story = {
  render: () => <LoggedIn>Only visible for logged in users.</LoggedIn>,
};

export const WithSpecificFactors: Story = {
  name: "With specific factors",
  render: () => (
    <LoggedIn withFactorMethods={["email_link", "otp_via_sms"]}>
      Only visible for the users authenticated with email magic link and SMS
      code.
    </LoggedIn>
  ),
};

export const WithFactorCount: Story = {
  name: "With factor count",
  render: () => (
    <LoggedIn withFactorMethods={(methods) => methods.length >= 2}>
      Only visible for the users authenticated with two or more factors.
    </LoggedIn>
  ),
};
