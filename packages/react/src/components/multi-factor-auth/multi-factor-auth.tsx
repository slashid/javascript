import type { Factor } from "@slashid/slashid";
import { Form } from "../form";
import { LoggedIn } from "../logged-in";
import { LoggedOut } from "../logged-out";
import { MFAProvider } from "../../context/config-context";
import { TextConfig } from "../text/constants";

type MultiFactorAuthProps = {
  factors: Factor[];
  text?: Partial<TextConfig>;
};

/**
 * First-class Multi-Factor Authentication experience.
 * This component can be used instead of regular `<Form />`.
 * After successful authentication with one of the factors defined in a `<ConfigurationProvider>`,
 * the user will _immediately_ be prompted with second step (`factors` prop).
 */
export function MultiFactorAuth({ factors, text }: MultiFactorAuthProps) {
  return (
    <>
      <LoggedOut>
        <Form />
      </LoggedOut>
      <LoggedIn>
        <MFAProvider
          factors={factors}
          text={{
            "initial.title": "Multi-Factor Authentication",
            ...(text ? text : {}),
          }}
        >
          <Form />
        </MFAProvider>
      </LoggedIn>
    </>
  );
}
