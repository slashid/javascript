import { Meta, StoryObj } from "@storybook/react";
import { OrganizationSwitcher } from ".";

const meta: Meta<typeof OrganizationSwitcher> = {
  component: OrganizationSwitcher,
};

export default meta;

type Story = StoryObj<typeof OrganizationSwitcher>;

export const Default: Story = {
  render: () => <OrganizationSwitcher />,
};

export const WithFiltering: Story = {
  name: "With filtering",
  render: () => (
    <OrganizationSwitcher
      filter={(org) => !org.org_name.startsWith("private_")}
    />
  ),
};

export const WithFallback: Story = {
  name: "With fallback",
  render: () => <OrganizationSwitcher fallback={<div>Please wait...</div>} />,
};

export const WithLabelOverride: Story = {
  name: "With rendered organization name override",
  render: () => (
    <OrganizationSwitcher
      renderLabel={(org) => `${org.org_name} (${org.tenant_name})`}
    />
  ),
};
