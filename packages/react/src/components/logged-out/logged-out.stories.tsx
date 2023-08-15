import { Meta, StoryObj } from "@storybook/react";
import { LoggedOut } from ".";

const meta: Meta<typeof LoggedOut> = {
  component: LoggedOut,
};

export default meta;

type Story = StoryObj<typeof LoggedOut>;

export const Primary: Story = {
  render: () => <LoggedOut>Only visible for un-authenticated users.</LoggedOut>,
};
