import { useFormo, validators } from "@buildo/formo";
import { failure, success } from "@buildo/formo/lib/Result";
import type { DocumentSide, KYC, KYCStatus } from "@slashid/kyc";
import { Country } from "@slashid/kyc";
import {
  AreaLoader,
  Form,
  FormRow,
  FormSection,
  SelectField,
  TextField,
} from "design-system";
import { useEffect, useState } from "react";

const isSomeEnumValue =
  <T extends { [s: string]: unknown }>(e: T) =>
  (value: unknown): value is T[keyof T] =>
    Object.values(e).includes(value as T[keyof T]);

export function Create(props: {
  kyc: KYC;
  onCreated: (flowId: string) => void;
  onResumed: (
    flowId: string,
    status: KYCStatus,
    documentSides?: Array<DocumentSide>,
    remainingDocumentSides?: Array<DocumentSide>
  ) => void;
}) {
  const [loading, setLoading] = useState(true);

  const countriesOptions = Object.values(Country)
    .filter(isSomeEnumValue(Country))
    .map((c: Country) => ({
      label: c.toString(),
      value: c,
      kind: "single-line" as const,
    }));

  const { fieldProps, handleSubmit, formErrors } = useFormo(
    {
      initialValues: {
        name: "",
        surname: "",
        issuingCountry: countriesOptions[0].value as Country | undefined,
      },
      fieldValidators: () => ({
        name: validators.minLength(1, "Name cannot be empty"),
        surname: validators.minLength(1, "Surname cannot be empty"),
        issuingCountry: validators.defined<Country | undefined, string>(
          "Issuing country cannot be empty"
        ),
      }),
    },
    {
      onSubmit: ({ name, surname, issuingCountry }) => {
        setLoading(true);
        return props.kyc.create(issuingCountry, name, surname).then(
          (res) => {
            setLoading(false);
            return success(props.onCreated(res.flowId));
          },
          () => {
            setLoading(false);
            return failure(
              "Something went wrong while starting the verification flow. Please retry later."
            );
          }
        );
      },
    }
  );

  // Check if the user has a pending flow
  useEffect(() => {
    props.kyc.resumeLastFlow().then((flow) => {
      setLoading(false);
      flow &&
        props.onResumed(
          flow.flowId,
          flow.status,
          flow.documentSides,
          flow.remainingDocumentSides
        );
    });
  }, []);

  // prefill user first and last name, if available
  useEffect(() => {
    props.kyc.getUserDetails().then(({ firstName, lastName }) => {
      setLoading(false);
      if (firstName && fieldProps("name").value === "") {
        fieldProps("name").onChange(firstName);
      }
      if (lastName && fieldProps("surname").value === "") {
        fieldProps("surname").onChange(lastName);
      }
    });
  }, []);

  return loading ? (
    <AreaLoader />
  ) : (
    <Form
      title="Your details"
      description="Fill in the fields with the requested information."
      submitButton={{
        onPress: handleSubmit,
        label: "Continue",
      }}
      error={formErrors}
    >
      <FormSection>
        <FormRow>
          <TextField
            {...fieldProps("name")}
            label="First name"
            name="name"
            placeholder="Your first name"
            disabled={loading}
          />
        </FormRow>
        <FormRow>
          <TextField
            {...fieldProps("surname")}
            label="Last name"
            name="surname"
            placeholder="Your last name"
            disabled={loading}
          />
        </FormRow>
        <FormRow>
          <SelectField
            {...fieldProps("issuingCountry")}
            label="Country of issue"
            name="country"
            options={countriesOptions}
            placeholder="Your document country of issue"
            disabled={loading}
          />
        </FormRow>
      </FormSection>
    </Form>
  );
}
