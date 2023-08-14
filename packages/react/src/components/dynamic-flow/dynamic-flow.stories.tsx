import { Meta, StoryObj } from "@storybook/react";
import { DynamicFlow } from ".";

const meta: Meta<typeof DynamicFlow> = {
  component: DynamicFlow,
};

export default meta;

type Story = StoryObj<typeof DynamicFlow>;

export const Primary: Story = {
  render: () => <DynamicFlow getFactor={() => ({ method: "email_link" })} />,
};
