import { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: () => <Button variant="primary">Button</Button>,
};

export const Secondary: Story = {
  render: () => <Button variant="secondary">Button</Button>,
};
