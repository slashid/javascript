import { Meta, StoryObj } from "@storybook/react";
import { Groups } from ".";

const meta: Meta<typeof Groups> = {
  component: Groups,
};

export default meta;

type Story = StoryObj<typeof Groups>;

export const Default: Story = {
  render: () => (
    <Groups belongsTo={"admin"}>
      Only visible for admins.
    </Groups>
  ),
};

export const Or: Story = {
  name: "User has one or more groups",
  render: () => (
    <Groups belongsTo={Groups.some("admin", "sudo")}>
      Visible for admins or sudoers
    </Groups>
  ),
};

export const And: Story = {
  name: "User has all groups",
  render: () => (
    <Groups belongsTo={Groups.all("admin", "sudo")}>
      Only visible for users who are both admin and sudoer.
    </Groups>
  ),
};
