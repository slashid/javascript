import {
  AreaLoader,
  CheckboxField,
  Form,
  FormRow,
  FormSection,
} from "design-system";
import type { KYC } from "@slashid/kyc";
import { useState } from "react";
import { useFormo, validators } from "@buildo/formo";
import { failure, success } from "@buildo/formo/lib/Result";

export function ConsentAndVerify(props: {
  flowId: string;
  kyc: KYC;
  onConsentGranted: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const { fieldProps, handleSubmit, formErrors } = useFormo(
    {
      initialValues: {
        granted: false,
      },
      fieldValidators: () => ({
        granted: validators.validator((granted: boolean) =>
          granted
            ? success(granted)
            : failure(
                "The privacy consent is required for document verification."
              )
        ),
      }),
    },
    {
      onSubmit: ({ granted }) => {
        setLoading(true);
        return props.kyc
          .savePrivacyConsent(props.flowId, granted)
          .then(() => props.kyc.verify(props.flowId))
          .then(
            () => {
              setLoading(false);
              return success(props.onConsentGranted());
            },
            () => {
              setLoading(false);
              return failure("Something went wrong. Please retry later.");
            }
          );
      },
    }
  );

  return (
    <Form
      title="Privacy consent"
      description="Before proceeding with document verification, please read the Privacy Policy and grant the privacy consent."
      submitButton={{
        onPress: handleSubmit,
        label: "Continue",
      }}
      error={formErrors}
    >
      <FormSection>
        <FormRow>
          <CheckboxField
            {...fieldProps("granted")}
            label="I grant my consent to document verification. "
            name="granted"
          />
        </FormRow>
        {loading && <AreaLoader />}
      </FormSection>
    </Form>
  );
}
