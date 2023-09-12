import { Validator, useEffect, useMemo, useState } from "react";
import {
  filterFactors,
  getHandleTypes,
  isFactorNonOidc,
  isFactorOidc,
  parsePhoneNumber,
} from "../../../domain/handles";
import { useConfiguration } from "../../../hooks/use-configuration";
import { FactorNonOIDC, Handle, HandleType } from "../../../domain/types";
import { TextConfig } from "../../text/constants";
import { useInternalFormContext } from "../form";
import { useForm } from "../../../hooks/use-form";
import { Factor } from "@slashid/slashid";
import { Flag, findFlag } from "country-list-with-dial-code-and-flag";
import { sprinkles } from "../../../theme/sprinkles.css";
import { Dropdown } from "../../dropdown";
import { GB_FLAG, Input, PhoneInput } from "../../input";
import { ErrorMessage } from "../error-message";
import { isValidPhoneNumber, isValidEmail } from "../validation";
import { FACTOR_LABEL_MAP } from "./handle-form";

type ControlsProps = {
  factors: FactorNonOIDC[];
  handleTypes: Handle["type"][];
  text: TextConfig;
};

type Props = {
  children?:
    | React.ReactNode
    | (({ factors, handleTypes }: ControlsProps) => React.ReactNode);
};

export const Controls = ({ children }: Props) => {
  // manage the form state here

  // selected handle type based on tabs

  // submit handler

  const { factors, text } = useConfiguration();
  const { handleSubmit, submitPayloadRef, selectedFactor } =
    useInternalFormContext();
  const { registerSubmit } = useForm();

  // @ts-expect-error TODO fix inference
  const nonOidcFactors: FactorNonOIDC[] = useMemo(
    () => factors.filter((f) => isFactorNonOidc(f)),
    [factors]
  );

  // TODO move this up
  /*   const shouldRenderDivider = useMemo(
    () => hasOidcAndNonOidcFactors(factors),
    [factors]
  ); */

  const handleTypes = useMemo(() => {
    return getHandleTypes(factors);
  }, [factors]);

  if (nonOidcFactors.length === 0) {
    return null;
  }

  // prepare the submit handler
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // cancel if the form is invalid
    if (
      !submitPayloadRef.current.handleType ||
      !submitPayloadRef.current.handleValue ||
      !selectedFactor
    )
      return;
    const { handleType, handleValue } = submitPayloadRef.current;

    // TODO flag value chaos - should be resolved on the lower level
    handleSubmit(selectedFactor, {
      type: handleType,
      value: handleValue,
    });
  };

  if (typeof children === "function") {
    // consider if the form element should be rendered here - probably so
    return (
      <form onSubmit={registerSubmit(onSubmit)}>
        {children({ factors: nonOidcFactors, handleTypes, text })}
      </form>
    );
  }

  // get the configured form
  // split it so it can render controls separately
  // pass the controls as props
  // also pass the functions to be used instead of controls

  // TODO can we use asChild pattern instead of render props

  return (
    <form onSubmit={registerSubmit(onSubmit)}>
      {children || (
        <>
          <FormInput />
          <Submit />
        </>
      )}
    </form>
  );
};

const FormInput = () => {
  const { handleSubmit, submitPayloadRef } = useInternalFormContext();
  const { factors } = useConfiguration();

  // @ts-expect-error TODO fix inference
  const nonOidcFactors: FactorNonOIDC[] = useMemo(
    () => factors.filter((f) => isFactorNonOidc(f)),
    [factors]
  );
  // case: 1 input

  // case: tabs

  // TODO last handle support

  return (
    <HandleForm
      handleSubmit={handleSubmit}
      handleType={submitPayloadRef.current.handleType || "email_address"}
      factors={nonOidcFactors}
    />
  );
};

FormInput.displayName = "Input";

function Submit() {
  // render submit button based on context values
  return null;
}

type PropsInternal = {
  handleType: HandleType;
  factors: Factor[];
  handleSubmit: (factor: Factor, handle: Handle) => void;
  validate?: Validator<string>;
  defaultValue?: string;
};

export const HandleForm: React.FC<PropsInternal> = ({
  handleType,
  factors,
  defaultValue,
}) => {
  const { setSelectedFactor } = useInternalFormContext();
  const filteredFactors = useMemo(
    () => filterFactors(factors, handleType).filter((f) => !isFactorOidc(f)),
    [factors, handleType]
  );
  const shouldRenderFactorDropdown = filteredFactors.length > 1;
  const { registerField, values, resetForm } = useForm();
  const parsedPhoneNumber = parsePhoneNumber(defaultValue ?? "");
  const [flag, setFlag] = useState<Flag>(
    findFlag(parsedPhoneNumber?.countryCode ?? "") ?? GB_FLAG
  );
  const { text } = useConfiguration();

  useEffect(() => {
    setSelectedFactor(filteredFactors[0]);
  }, [filteredFactors, setSelectedFactor]);

  useEffect(() => {
    return resetForm;
  }, [resetForm]);

  const input = useMemo(() => {
    if (handleType === "phone_number") {
      return (
        <PhoneInput
          className={sprinkles({ marginTop: "4" })}
          id={`sid-input-${handleType}`}
          name={handleType}
          label={text["initial.handle.phone"]}
          placeholder={text["initial.handle.phone.placeholder"]}
          value={values[handleType] ?? ""}
          flag={flag}
          onChange={registerField(handleType, {
            defaultValue: parsedPhoneNumber?.number,
            validator: (value) => {
              if (!isValidPhoneNumber(value)) {
                return { message: text["validationError.phoneNumber"] };
              }
            },
          })}
          onFlagChange={setFlag}
        />
      );
    }

    return (
      <Input
        className={sprinkles({ marginTop: "4" })}
        id={`sid-input-${handleType}`}
        name={handleType}
        label={text["initial.handle.email"]}
        placeholder={text["initial.handle.phone.email"]}
        value={values[handleType] ?? ""}
        onChange={registerField(handleType, {
          defaultValue,
          validator: (value) => {
            if (!isValidEmail(value)) {
              return { message: text["validationError.email"] };
            }
          },
        })}
      />
    );
  }, [
    flag,
    handleType,
    text,
    registerField,
    values,
    defaultValue,
    parsedPhoneNumber,
  ]);

  return (
    <>
      {shouldRenderFactorDropdown && (
        <Dropdown
          defaultValue={filteredFactors[0].method}
          className={sprinkles({ marginBottom: "3", marginTop: "6" })}
          label={text["initial.authenticationMethod"]}
          items={filteredFactors.map((f) => ({
            label: text[FACTOR_LABEL_MAP[f.method]],
            value: f.method,
          }))}
          onChange={(method) => {
            const newFactor = filteredFactors.find((f) => f.method === method)!;
            setSelectedFactor(newFactor);
          }}
        />
      )}
      {input}
      <ErrorMessage name={handleType} />
    </>
  );
};

Controls.displayName = "Controls";
Controls.Input = FormInput;
