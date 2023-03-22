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
