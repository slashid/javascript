import { Meta, StoryObj } from "@storybook/react";
import { GDPRConsentDialog } from ".";
import { ConfigurationProvider } from "../../context/config-context";

const meta: Meta<typeof GDPRConsentDialog> = {
  component: GDPRConsentDialog,
};

export default meta;

type Story = StoryObj<typeof GDPRConsentDialog>;

export const Default: Story = {
  render: () => (
    <ConfigurationProvider>
      <GDPRConsentDialog />
    </ConfigurationProvider>
  ),
};

export const WithClassName: Story = {
  name: "With className",
  render: () => (
    <ConfigurationProvider>
      <style>
        {`
          .gdprConsentDialogClass {
            max-height: 600px;
          }
        `}
      </style>
      <GDPRConsentDialog className="gdprConsentDialogClass" />
    </ConfigurationProvider>
  ),
};

export const WithTriggerClassName: Story = {
  name: "With triggerClassName",
  render: () => (
    <ConfigurationProvider>
      <style>
        {`
          .gdprConsentDialogTriggerClass {
            border-radius: 15px;
          }
        `}
      </style>
      <GDPRConsentDialog triggerClassName="gdprConsentDialogTriggerClass" />
    </ConfigurationProvider>
  ),
};

export const WithSuccessCallback: Story = {
  name: "With success callback",
  render: () => (
    <ConfigurationProvider>
      <GDPRConsentDialog
        onSuccess={(user) => {
          console.log("onSuccess - user: ", user);
        }}
      />
    </ConfigurationProvider>
  ),
};

export const WithTextOverride: Story = {
  name: "With text override",
  render: () => (
    <ConfigurationProvider
      text={{
        "gdpr.consent.necessary.description":
          "Cookies that are essential to provide the service you have requested or which are required to comply with legal requirements, like data protection laws.",
      }}
    >
      <GDPRConsentDialog />
    </ConfigurationProvider>
  ),
};
