import type { Factor } from "@slashid/slashid";
import type { FormProps } from "../form";
import { Form } from "../form";
import { LoggedIn } from "../logged-in";
import { LoggedOut } from "../logged-out";
import { MFAProvider } from "../../context/config-context";
import { TextConfig } from "../text/constants";

type MultiFactorAuthProps = FormProps & {
  factors: Factor[];
  text?: Partial<TextConfig>;
};

/**
 * First-class Multi-Factor Authentication experience.
 * This component can be used instead of regular `<Form />`.
 * After successful authentication with one of the factors defined in a `<ConfigurationProvider>`,
 * the user will _immediately_ be prompted with second step - one of the `factors`.
 */
export function MultiFactorAuth({
  factors,
  text,
  className,
  onSuccess,
}: MultiFactorAuthProps) {
  return (
    <>
      <LoggedOut>
        <Form className={className} />
      </LoggedOut>
      <LoggedIn>
        <MFAProvider
          factors={factors}
          text={{
            "initial.title": "Multi-Factor Authentication",
            ...(text ? text : {}),
          }}
        >
          <Form className={className} onSuccess={onSuccess} />
        </MFAProvider>
      </LoggedIn>
    </>
  );
}
