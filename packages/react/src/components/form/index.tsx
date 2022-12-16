import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { ConfigurationProvider } from "../../context/config-context";

import { Form as BaseForm, Props } from "./form";

export const Form: React.FC<Props> = ({ className }) => {
  return (
    <ConfigurationProvider
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
        { method: "oidc", options: { provider: "apple" } },
        // @ts-expect-error TODO fix the enum related problems
        { method: "oidc", options: { provider: "github" } },
      ]}
    >
      <BaseForm className={className} />
    </ConfigurationProvider>
  );
};
