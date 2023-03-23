import type { FormProps } from "../form";
import { Form } from "../form";
import { LoggedIn } from "../logged-in";

type StepUpAuthProps = FormProps;

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
      <Form
        className={className}
        factors={factors}
        text={{
          "initial.title": "Confirm it's you",
          "initial.subtitle": "Reauthenticate to proceed",
          ...(text ? text : {}),
        }}
        onSuccess={onSuccess}
      />
    </LoggedIn>
  );
}
