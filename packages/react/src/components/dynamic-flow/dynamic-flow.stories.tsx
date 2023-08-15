import { Meta, StoryObj } from "@storybook/react";
import { DynamicFlow } from ".";
import { ConfigurationProvider } from "../../context/config-context";

const meta: Meta<typeof DynamicFlow> = {
  component: DynamicFlow,
};

export default meta;

type Story = StoryObj<typeof DynamicFlow>;

export const Primary: Story = {
  render: () => (
    <div>
      <h2>Dynamic flow - factor based on handle</h2>
      <ConfigurationProvider text={{ "initial.oidc": "Continue with" }}>
        <DynamicFlow getFactor={() => ({ method: "email_link" })} />
      </ConfigurationProvider>
    </div>
  ),
};
