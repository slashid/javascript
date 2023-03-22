import type { Factor } from "@slashid/slashid";
import type { FormProps } from "../form";
import { Form } from "../form";
import { TextConfig } from "../text/constants";
import { LoggedIn } from "../logged-in";
import { MFAProvider } from "../../context/config-context";

type StepUpAuthProps = FormProps & {
  factors: Factor[];
  text?: Partial<TextConfig>;
};
/**
 * Step-Up Authentication challenge for already logged in users to reauthenticate.
 * It can be used to grant access to high-risk resources or interaction with sensitive data.
 */
export function StepUpAuth({
  factors,
  text,
  className,
  onSuccess,
}: StepUpAuthProps) {
  return (
    <LoggedIn>
      <MFAProvider
        factors={factors}
        text={{
          "initial.title": "Confirm it's you",
          "initial.subtitle": "Reauthenticate to proceed",
          ...(text ? text : {}),
        }}
      >
        <Form className={className} onSuccess={onSuccess} />
      </MFAProvider>
    </LoggedIn>
  );
}
