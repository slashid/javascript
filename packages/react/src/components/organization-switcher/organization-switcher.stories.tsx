import { Meta, StoryObj } from "@storybook/react";
import { OrganizationSwitcher } from ".";

const meta: Meta<typeof OrganizationSwitcher> = {
  component: OrganizationSwitcher,
};

export default meta;

type Story = StoryObj<typeof OrganizationSwitcher>;

export const Primary: Story = {
  render: () => <OrganizationSwitcher />,
};