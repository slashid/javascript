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

export const Secondary: Story = {
  render: () => (
    <OrganizationSwitcher
      filter={(org) => !org.org_name.startsWith("private_")}
    />
  ),
};
