import { Meta, StoryObj } from "@storybook/react";
import { Form } from ".";
import { ConfigurationProvider } from "../../context/config-context";

const meta: Meta<typeof Form> = {
  component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Primary: Story = {
  render: () => (
    <ConfigurationProvider>
      <Form
        middleware={({ user }) => {
          console.log("middleware - user: ", user);
          return new Promise((resolve) => {
            resolve(user);
          });
        }}
        factors={[{ method: "email_link" }, { method: "otp_via_sms" }]}
        text={{
          "initial.title": "Multi-Factor Authentication",
        }}
        onSuccess={(user) => {
          console.log("onSuccess - user: ", user);
        }}
      />
    </ConfigurationProvider>
  ),
};
