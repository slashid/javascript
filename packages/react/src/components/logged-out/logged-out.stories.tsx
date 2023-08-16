import { Meta, StoryObj } from "@storybook/react";
import { LoggedOut } from ".";
import { SlashIDLoaded } from "../loaded";

const meta: Meta<typeof LoggedOut> = {
  component: LoggedOut,
};

export default meta;

type Story = StoryObj<typeof LoggedOut>;

export const Default: Story = {
  render: () => <LoggedOut>Only visible for un-authenticated users.</LoggedOut>,
};

export const WithFallbackDuringSDKInitialisation: Story = {
  name: "With fallback during SDK initialisation",
  render: () => (
    <SlashIDLoaded fallback={<div>Please wait...</div>}>
      <LoggedOut>Only visible for un-authenticated users.</LoggedOut>
    </SlashIDLoaded>
  ),
};
