import { Factor } from "@slashid/slashid";
import { findFlag } from "country-list-with-dial-code-and-flag";
import { Validator, useMemo, useState, useEffect } from "react";
import {
  filterFactors,
  isFactorOidc,
  parsePhoneNumber,
} from "../../../domain/handles";
import { HandleType, Handle } from "../../../domain/types";
import { useConfiguration } from "../../../hooks/use-configuration";
import { useForm } from "../../../hooks/use-form";

import { Button } from "../../button";
import { Dropdown } from "../../dropdown";
import { Flag, GB_FLAG, PhoneInput, Input } from "../../input";
import { ErrorMessage } from "../error-message";
import { isValidPhoneNumber, isValidEmail } from "../validation";
import { TextConfigKey } from "../../text/constants";
import { sprinkles } from "../../../theme/sprinkles.css";

export const FACTOR_LABEL_MAP: Record<
  Exclude<Factor["method"], "webauthn_via_email" | "webauthn_via_sms">,
  TextConfigKey
> = {
  email_link: "factor.emailLink",
  otp_via_sms: "factor.otpViaSms",
  sms_link: "factor.smsLink",
  webauthn: "factor.webauthn",
  oidc: "",
};

export type Props = {
  handleType: HandleType;
  factors: Factor[];
  handleSubmit: (factor: Factor, handle: Handle) => void;
  validate?: Validator<string>;
  defaultValue?: string;
};

export const HandleForm: React.FC<Props> = ({
  handleType,
  factors,
  handleSubmit,
  defaultValue,
}) => {
  const filteredFactors = useMemo(
    () => filterFactors(factors, handleType).filter((f) => !isFactorOidc(f)),
    [factors, handleType]
  );
  const shouldRenderFactorDropdown = filteredFactors.length > 1;
  const { registerField, registerSubmit, values, status, resetForm } =
    useForm();
  const parsedPhoneNumber = parsePhoneNumber(defaultValue ?? "");
  const [flag, setFlag] = useState<Flag>(
    findFlag(parsedPhoneNumber?.countryCode ?? "") ?? GB_FLAG
  );
  const [factor, setFactor] = useState<Factor>(filteredFactors[0]);
  const { text } = useConfiguration();

  useEffect(() => {
    setFactor(filteredFactors[0]);
  }, [filteredFactors]);

  useEffect(() => {
    return resetForm;
  }, [resetForm]);

  const input = useMemo(() => {
    if (handleType === "phone_number") {
      return (
        <PhoneInput
          className={sprinkles({ marginTop: "3" })}
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
        className={sprinkles({ marginTop: "3" })}
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

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    handleSubmit(factor, {
      type: handleType,
      value:
        handleType === "email_address"
          ? values[handleType]
          : `${flag.dial_code}${values[handleType]}`,
    });
  };

  return (
    <form onSubmit={registerSubmit(onSubmit)}>
      {shouldRenderFactorDropdown && (
        <Dropdown
          defaultValue={filteredFactors[0].method}
          className={sprinkles({ marginBottom: "3", marginTop: "5" })}
          label={text["initial.authenticationMethod"]}
          items={filteredFactors.map((f) => ({
            label: text[FACTOR_LABEL_MAP[f.method]],
            value: f.method,
          }))}
          onChange={(method) =>
            setFactor(factors.find((f) => f.method === method)!)
          }
        />
      )}
      {input}
      <ErrorMessage name={handleType} />
      <Button
        className={sprinkles({ marginTop: "4" })}
        type="submit"
        variant="primary"
        testId="sid-form-initial-submit-button"
        disabled={status === "invalid"}
      >
        {text["initial.submit"]}
      </Button>
    </form>
  );
};
