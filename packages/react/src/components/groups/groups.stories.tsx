import { Meta, StoryObj } from "@storybook/react";
import { Groups } from ".";

const meta: Meta<typeof Groups> = {
  component: Groups,
};

export default meta;

type Story = StoryObj<typeof Groups>;

export const Default: Story = {
  render: () => (
    <Groups belongsTo={(groups) => groups.includes("admin")}>
      Only visible for admins.
    </Groups>
  ),
};
