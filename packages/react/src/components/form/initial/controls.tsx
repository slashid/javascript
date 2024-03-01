import { Factor } from "@slashid/slashid";
import { Flag, findFlag } from "country-list-with-dial-code-and-flag";
import { Children, useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  PhoneInput,
  Dropdown,
  Tabs,
  sprinkles,
} from "@slashid/react-primitives";
import { FormStatus } from "../../../context/form-context";
import {
  filterFactors,
  getHandleTypes,
  isFactorNonOidc,
  isFactorOidc,
  parsePhoneNumber,
  resolveLastHandleValue,
} from "../../../domain/handles";
import { FactorNonOIDC, Handle, HandleType } from "../../../domain/types";
import { useConfiguration } from "../../../hooks/use-configuration";
import { useForm } from "../../../hooks/use-form";
import { TextConfig, TextConfigKey } from "../../text/constants";
import { ErrorMessage } from "../error-message";
import { isValidEmail, isValidPhoneNumber } from "../authenticating/validation";
import { passkeysSupported } from '../../../passkey'

import * as styles from "./initial.css";
import { useInternalFormContext } from "../internal-context";

export const FACTOR_LABEL_MAP: Record<
  Exclude<Factor["method"], "webauthn_via_email" | "webauthn_via_sms">,
  TextConfigKey
> = {
  email_link: "factor.emailLink",
  otp_via_sms: "factor.otpViaSms",
  otp_via_email: "factor.otpViaEmail",
  sms_link: "factor.smsLink",
  webauthn: "factor.webauthn",
  password: "factor.password",
  oidc: "",
  saml: "",
};

export const TAB_NAME = {
  email: "email",
  phone: "phone",
};

export const tabIDByHandle: Record<HandleType, string> = {
  phone_number: TAB_NAME.phone,
  email_address: TAB_NAME.email,
};

type ControlsProps = {
  factors: FactorNonOIDC[];
  handleTypes: Handle["type"][];
  text: TextConfig;
  handleSubmit: (factor: Factor, handle?: Handle) => void;
};

type Props = {
  children?:
    | React.ReactNode
    | (({
        factors,
        handleTypes,
        text,
        handleSubmit,
      }: ControlsProps) => React.ReactNode);
};

/**
 * Component responsible for rendering the form and the related controls.
 * Sets up the form context and provides the submit handler.
 */
export const Controls = ({ children }: Props) => {
  const { factors, text } = useConfiguration();
  const { handleSubmit, submitPayloadRef, selectedFactor } =
    useInternalFormContext();
  const { registerSubmit } = useForm();

  // @ts-expect-error TODO fix inference
  const nonOidcFactors: FactorNonOIDC[] = useMemo(
    () => factors.filter((f) => isFactorNonOidc(f)),
    [factors]
  );

  const handleTypes = useMemo(() => {
    return getHandleTypes(factors);
  }, [factors]);

  if (nonOidcFactors.length === 0) {
    return null;
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // cancel if the form is invalid
    if (
      !submitPayloadRef.current.handleType ||
      !submitPayloadRef.current.handleValue ||
      !selectedFactor
    )
      return;

    const { handleType, handleValue, flag } = submitPayloadRef.current;

    if (handleType === "phone_number" && !flag) {
      return;
    }

    handleSubmit(selectedFactor, {
      type: handleType,
      value:
        handleType === "phone_number"
          ? `${flag!.dial_code}${handleValue}`
          : handleValue,
    });
  };

  if (typeof children === "function") {
    // consider if the form element should be rendered here - probably so
    return (
      <div data-testid="sid-form-initial-function">
        {children({ handleSubmit, factors: nonOidcFactors, handleTypes, text })}
      </div>
    );
  }

  // TODO can we use asChild pattern from Radix instead of render props
  if (Children.count(children) > 0)
    return (
      <form
        data-testid="sid-form-initial-children"
        onSubmit={registerSubmit(onSubmit)}
      >
        {children}
      </form>
    );

  return (
    <form
      data-testid="sid-form-initial-default"
      onSubmit={registerSubmit(onSubmit)}
    >
      <FormInput />
      <Submit />
    </form>
  );
};

type FormInputProps = {
  children?:
    | React.ReactNode
    | (({
        factors,
        handleTypes,
      }: {
        factors: FactorNonOIDC[];
        handleTypes: HandleType[];
      }) => React.ReactNode);
};

/**
 * Component responsible for rendering the form input fields.
 * This includes managing the handle types and appropriate input fields.
 * Tabs will be rendered if there are multiple handle types.
 */
const FormInput = ({ children }: FormInputProps) => {
  const { lastHandle } = useInternalFormContext();
  const { factors, text } = useConfiguration();

  const [showPasskeys, setShowPasskeys] = useState<boolean | null>(null)
  useEffect(() => {
    (async () => {
      const isSupported = await passkeysSupported
      setShowPasskeys(isSupported)
      console.log('passkey support', isSupported)
    })()
  }, [])

  // @ts-expect-error TODO fix inference
  const nonOidcFactors: FactorNonOIDC[] = useMemo(
    () => factors.filter((f) => {
      if (f.method === "webauthn" && showPasskeys === false) return false
      return isFactorNonOidc(f)
    }),
    [factors, showPasskeys]
  );

  const handleTypes = useMemo(() => {
    return getHandleTypes(factors);
  }, [factors]);

  if (showPasskeys === null) {
    return null
  }

  if (typeof children === "function") {
    return <>{children({ factors: nonOidcFactors, handleTypes })}</>;
  }

  if (Children.count(children) > 0) {
    return <>{children}</>;
  }

  if (handleTypes.length === 1) {
    return (
      <>
        <HandleInput
          factors={nonOidcFactors}
          handleType={handleTypes[0]}
          defaultValue={resolveLastHandleValue(lastHandle, handleTypes[0])}
        />
      </>
    );
  } else {
    return (
      <Tabs
        testId="sid-handle-type-tabs"
        className={sprinkles({ marginY: "6" })}
        defaultValue={tabIDByHandle[lastHandle?.type ?? "email_address"]}
        tabs={[
          {
            id: TAB_NAME.email,
            title: text["initial.handle.email"],
            content: (
              <HandleInput
                factors={nonOidcFactors}
                handleType="email_address"
                defaultValue={resolveLastHandleValue(
                  lastHandle,
                  "email_address"
                )}
              />
            ),
          },
          {
            id: TAB_NAME.phone,
            title: text["initial.handle.phone"],
            content: (
              <HandleInput
                factors={nonOidcFactors}
                handleType="phone_number"
                defaultValue={resolveLastHandleValue(
                  lastHandle,
                  "phone_number"
                )}
              />
            ),
          },
        ]}
      />
    );
  }
};

FormInput.displayName = "Input";

type SubmitProps = {
  children?:
    | React.ReactNode
    | (({
        text,
        status,
      }: {
        text: TextConfig;
        status: FormStatus;
      }) => React.ReactNode);
};

/**
 * Component responsible for rendering the submit control.
 * Can be overriden by the user.
 */
const Submit = ({ children }: SubmitProps) => {
  const { text } = useConfiguration();
  const { status } = useForm();

  // render submit button based on context values
  if (typeof children === "function") {
    return <>{children({ text, status })}</>;
  }

  if (Children.count(children) > 0) {
    return <>{children}</>;
  }

  return (
    <Button
      className={sprinkles({ marginTop: "6" })}
      type="submit"
      variant="primary"
      testId="sid-form-initial-submit-button"
      disabled={status === "invalid"}
    >
      {text["initial.submit"]}
    </Button>
  );
};

Submit.displayName = "Submit";

type PropsInternal = {
  handleType: HandleType;
  factors: Factor[];
  defaultValue?: string;
};

/**
 * Responsible for rendering a specific input field based on the handle type.
 */
const HandleInput: React.FC<PropsInternal> = ({
  handleType,
  factors,
  defaultValue,
}) => {
  const { setSelectedFactor, submitPayloadRef } = useInternalFormContext();
  const filteredFactors = useMemo(
    () => filterFactors(factors, handleType).filter((f) => !isFactorOidc(f)),
    [factors, handleType]
  );
  const { text, defaultCountryCode } = useConfiguration();
  const { registerField, values, resetForm } = useForm();

  const shouldRenderFactorDropdown = filteredFactors.length > 1;
  const parsedPhoneNumber = parsePhoneNumber(defaultValue ?? "");
  const [flag, setFlag] = useState<Flag>(
    findFlag(parsedPhoneNumber?.countryCode ?? defaultCountryCode)!
  );

  useEffect(() => {
    setSelectedFactor(filteredFactors[0]);
  }, [filteredFactors, setSelectedFactor]);

  useEffect(() => {
    return resetForm;
  }, [resetForm]);

  useEffect(() => {
    submitPayloadRef.current.flag = flag;
  }, [flag, submitPayloadRef]);

  useEffect(() => {
    const handleValue = values[handleType];
    submitPayloadRef.current = {
      ...submitPayloadRef.current,
      handleType,
      handleValue,
    };
  }, [handleType, submitPayloadRef, values]);

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
        placeholder={
          text["initial.handle.phone.email"] ||
          text["initial.handle.email.placeholder"]
        }
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
          contentProps={{
            className: styles.dropdownContent,
            position: "popper",
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
Controls.Submit = Submit;
