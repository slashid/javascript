import { Meta, StoryObj } from "@storybook/react";
import { SlashIDLoaded } from ".";

const meta: Meta<typeof SlashIDLoaded> = {
  component: SlashIDLoaded,
};

export default meta;

type Story = StoryObj<typeof SlashIDLoaded>;

export const Primary: Story = {
  render: () => (
    <SlashIDLoaded>
      <h1>SlashIDLoaded</h1>
    </SlashIDLoaded>
  ),
};
