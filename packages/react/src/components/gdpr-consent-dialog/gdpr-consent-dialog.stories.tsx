import {
  Controls,
  Description,
  Primary,
  Subtitle,
  Title,
} from "@storybook/blocks";
import { Meta, StoryObj } from "@storybook/react";
import { GDPRConsentDialog } from ".";
import { ConfigurationProvider } from "../../context/config-context";

const meta: Meta<typeof GDPRConsentDialog> = {
  component: GDPRConsentDialog,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          {/* we need to avoid showing all stories in the docs page to prevent multiple dialogs stacking on top of each other in the same position */}
        </>
      ),
    },
  },
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

export const WithCustomStyle: Story = {
  name: "With custom style",
  render: () => (
    <ConfigurationProvider>
      <style>
        {`
          .gdprConsentDialogClass {
            max-height: 600px;
            left: 12px;
            right: unset;
          }
          .gdprConsentDialogTriggerClass {
            left: 14px;
            right: unset;
          }
        `}
      </style>
      <GDPRConsentDialog
        className="gdprConsentDialogClass"
        triggerClassName="gdprConsentDialogTriggerClass"
      />
    </ConfigurationProvider>
  ),
};

export const WithSuccessCallback: Story = {
  name: "With success callback",
  render: () => (
    <ConfigurationProvider>
      <GDPRConsentDialog
        onSuccess={(consents) => console.log("onSuccess - consents:", consents)}
      />
    </ConfigurationProvider>
  ),
};

export const WithTextOverride: Story = {
  name: "With text override",
  render: () => (
    <ConfigurationProvider
      text={{
        "gdpr.dialog.title": "Why we use cookies?",
        "gdpr.dialog.subtitle":
          "Our site enables script (e.g. cookies) that is able to read, store, and write information on your browser and in your device.",
        "gdpr.consent.necessary.title": "Strictly Necessary Cookies",
        "gdpr.consent.necessary.description":
          "These cookies are set to provide the service, application or resource requested. Without these cookies, your request cannot be properly delivered. They are usually set to manage actions made by you, such as requesting website visual elements, pages resources or due user login/logoff. We can also use these cookies to set up essential functionalities to guarantee the security and efficiency of the service requested, like authentication and load balancer request.",
        "gdpr.consent.analytics.title": "Analytics Cookies",
        "gdpr.consent.analytics.description":
          "Cookies that are used for analytics or performance measurement purposes, like counting the number of unique visitors to our site, how long you stay on the site, and what parts of our site you visit.",
        "gdpr.consent.marketing.title": "Marketing Cookies",
        "gdpr.consent.marketing.description":
          "Cookies that are used to display advertising personalised to you (whether on or off our site) based on your browsing and profile.",
        "gdpr.consent.retargeting.title": "Retargeting Cookies",
        "gdpr.consent.retargeting.description":
          "Cookies that are used to display advertising personalised to you (whether on or off our site) based on your browsing and profile.",
        "gdpr.consent.tracking.title": "Tracking Cookies",
        "gdpr.consent.tracking.description":
          "Cookies that track your online behaviour, such as clicks, preferences, device specifications, location, and search history. This data helps in targeted advertising and gathering website analytics.",
      }}
    >
      <GDPRConsentDialog />
    </ConfigurationProvider>
  ),
};

export const WithNecessaryCookiesRequired: Story = {
  name: "With necessary cookies required",
  render: () => (
    <ConfigurationProvider>
      <GDPRConsentDialog
        necessaryCookiesRequired
        onSuccess={(consents) => console.log("onSuccess - consents:", consents)}
      />
    </ConfigurationProvider>
  ),
};

export const WithDefaultAcceptAllLevels: Story = {
  name: "With default accept all levels",
  render: () => (
    <ConfigurationProvider>
      <GDPRConsentDialog
        defaultAcceptAllLevels={["analytics", "marketing"]}
        onSuccess={(consents) => console.log("onSuccess - consents:", consents)}
      />
    </ConfigurationProvider>
  ),
};

export const WithDefaultRejectAllLevels: Story = {
  name: "With default reject all levels",
  render: () => (
    <ConfigurationProvider>
      <GDPRConsentDialog
        defaultRejectAllLevels={["none", "necessary"]}
        onSuccess={(consents) => console.log("onSuccess - consents:", consents)}
      />
    </ConfigurationProvider>
  ),
};

export const WithForceConsent: Story = {
  name: "With force consent",
  render: () => (
    <ConfigurationProvider>
      <GDPRConsentDialog forceConsent />
    </ConfigurationProvider>
  ),
};

export const WithForceOpen: Story = {
  name: "With force open",
  render: () => (
    <ConfigurationProvider>
      <GDPRConsentDialog forceOpen />
    </ConfigurationProvider>
  ),
};
