import { Meta, StoryObj } from "@storybook/react";
import { SlashIDLoaded } from ".";
import { LoggedOut } from "../logged-out";

const meta: Meta<typeof SlashIDLoaded> = {
  component: SlashIDLoaded,
};

export default meta;

type Story = StoryObj<typeof SlashIDLoaded>;

export const Default: Story = {
  render: () => (
    <SlashIDLoaded>
      <div>SlashID is ready!</div>
    </SlashIDLoaded>
  ),
};

export const WithFallback: Story = {
  name: "With fallback",
  render: () => (
    <SlashIDLoaded fallback={<div>Please wait...</div>}>
      <LoggedOut>Please log in</LoggedOut>
    </SlashIDLoaded>
  ),
};
