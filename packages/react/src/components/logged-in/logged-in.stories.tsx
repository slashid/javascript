import { Meta, StoryObj } from "@storybook/react";
import { LoggedIn } from ".";

const meta: Meta<typeof LoggedIn> = {
  component: LoggedIn,
};

export default meta;

type Story = StoryObj<typeof LoggedIn>;

export const Primary: Story = {
  render: () => <LoggedIn>LoggedIn</LoggedIn>,
};
