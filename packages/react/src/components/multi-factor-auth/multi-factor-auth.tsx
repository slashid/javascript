import type { Factor } from "@slashid/slashid";
import type { FormProps } from "../form";
import { Form } from "../form";
import { LoggedIn } from "../logged-in";
import { LoggedOut } from "../logged-out";
import { TextConfig } from "../text/constants";

export type StepConfig = {
  factors: Factor[];
  text?: Partial<TextConfig>;
};

type MultiFactorAuthProps = {
  steps: StepConfig[];
  className?: string;
  onSuccess?: FormProps["onSuccess"];
};

/**
 * First-class Multi-Factor Authentication experience.
 * This component can be used instead of regular `<Form />`.
 * After successful authentication with one of the factors defined in a `<ConfigurationProvider>`,
 * the user will _immediately_ be prompted with second step - one of the `factors`.
 */
export function MultiFactorAuth({
  steps,
  className,
  onSuccess,
}: MultiFactorAuthProps) {
  if (!steps.length) {
    return null;
  }

  const firstStep = steps[0];
  const nextSteps = steps.slice(1);

  return (
    <>
      <LoggedOut>
        <Form
          className={className}
          factors={firstStep.factors}
          text={firstStep.text}
        />
      </LoggedOut>
      {nextSteps.map(({ factors, text }, index) => (
        <LoggedIn
          key={index}
          withFactorMethods={(methods) => methods.length === index + 1}
        >
          <Form
            className={className}
            factors={factors}
            text={{
              "initial.title": "Multi-Factor Authentication",
              ...(text ? text : {}),
            }}
            onSuccess={index === nextSteps.length + 1 ? onSuccess : undefined}
          />
        </LoggedIn>
      ))}
    </>
  );
}
