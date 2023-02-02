import { ConfigurationProvider } from "../../context/config-context";

import { Form as BaseForm, Props } from "./form";

/**
 * Default configuration provider - used internally
 */
export const Form: React.FC<Props> = ({ className }) => {
  return (
    <ConfigurationProvider
      theme="dark"
      factors={[
        { method: "email_link" },
        { method: "webauthn" },
        { method: "otp_via_sms" },
        {
          method: "oidc",
          options: {
            // @ts-expect-error TODO fix the enum related problems
            provider: "google",
            client_id: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
          },
        },
        // @ts-expect-error TODO fix the enum related problems
        { method: "oidc", options: { provider: "facebook" } },
        // @ts-expect-error TODO fix the enum related problems
        { method: "oidc", options: { provider: "github" } },
      ]}
    >
      <BaseForm className={className} />
    </ConfigurationProvider>
  );
};
