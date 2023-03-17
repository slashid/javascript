import type { Factor } from "@slashid/slashid";
import { Form } from "../form";
import { LoggedIn } from "../logged-in";
import { LoggedOut } from "../logged-out";
import { MFAProvider } from "../../context/config-context";
import { TextConfig } from "../text/constants";
import { text } from "../text/text.css";

type MFAProps = {
  factors: Factor[];
  text?: Partial<TextConfig>;
};

export function MFA({ factors }: MFAProps) {
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
            ...text,
          }}
        >
          <Form />
        </MFAProvider>
      </LoggedIn>
    </>
  );
}
