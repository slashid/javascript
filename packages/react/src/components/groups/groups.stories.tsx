import { Meta, StoryObj } from "@storybook/react";
import { Groups } from ".";

const meta: Meta<typeof Groups> = {
  component: Groups,
};

export default meta;

type Story = StoryObj<typeof Groups>;

export const Primary: Story = {
  render: () => <Groups belongsTo={() => true}>Groups</Groups>,
};
