import { StoryObj } from "@storybook/react";
import { Button } from ".";

export default {
  component: Button,
};
// } satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: () => <Button variant="primary">Button</Button>,
};

export const Secondary: Story = {
  render: () => <Button variant="secondary">Button</Button>,
};
export { Button };
