import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Factor } from "@slashid/slashid";

import { Dropdown } from "../dropdown";
import { Text } from "../text";
import { InitialState } from "./flow";
import { Tabs } from "../tabs";
import { filterFactors, getHandleTypes } from "../../domain/handles";
import { useConfiguration } from "../../hooks/use-configuration";
import { Button } from "../button";
import {
  FactorOIDC,
  Handle,
  HandleType,
  isFactorOidc,
  Validator,
} from "../../domain/types";
import { Logo as TLogo } from "../../context/config-context";
import { Flag, GB_FLAG, Input, PhoneInput } from "../input";
import { TextConfigKey } from "../text/constants";

import * as styles from "./initial.css";
import { sprinkles, stack } from "../../theme/sprinkles.css";
import { Google } from "../icon/google";
import { Apple } from "../icon/apple";
import { Facebook } from "../icon/facebook";
import { Github } from "../icon/github";
import { Gitlab } from "../icon/gitlab";
import { Line } from "../icon/line";
import { Bitbucket } from "../icon/bitbucket";
import { Divider } from "../divider";
import { clsx } from "clsx";
import { isValidEmail, isValidPhoneNumber } from "./validation";
import { ErrorMessage } from "./error-message";
import { useForm } from "../../hooks/use-form";

type LogoProps = {
  logo?: TLogo;
};

const Logo: React.FC<LogoProps> = ({ logo }) => {
  if (typeof logo === "string") {
    return (
      <img className="sid-logo sid-logo--image" src={logo} alt="Company logo" />
    );
  }

  return <div className="sid-logo sid-logo--component">{logo}</div>;
};

const PROVIDER_TO_ICON: Record<string, React.ReactNode> = {
  google: <Google />,
  apple: <Apple />,
  facebook: <Facebook />,
  github: <Github />,
  gitlab: <Gitlab />,
  line: <Line />,
  bitbucket: <Bitbucket />,
};

type OidcProps = {
  providers: FactorOIDC[];
  handleClick: (factor: Factor) => void;
};

const Oidc: React.FC<OidcProps> = ({ providers, handleClick }) => {
  const { text } = useConfiguration();
  if (!providers.length) {
    return null;
  }

  return (
    <div className={clsx(stack, sprinkles({ marginTop: "4" }))}>
      {providers.map((p) => {
        if (!p.options?.provider) {
          return null;
        }

        return (
          <Button
            key={p.options?.provider}
            onClick={() => handleClick({ method: "oidc", options: p.options })}
            variant="secondary"
            icon={PROVIDER_TO_ICON[p.options?.provider]}
          >
            {text["initial.oidc"]}
            <span className={styles.oidcProvider}>{p.options?.provider}</span>
          </Button>
        );
      })}
    </div>
  );
};

const FACTOR_LABEL_MAP: Record<Factor["method"], TextConfigKey> = {
  email_link: "factor.emailLink",
  otp_via_sms: "factor.otpViaSms",
  sms_link: "factor.smsLink",
  webauthn: "factor.webauthn",
  oidc: "",
  webauthn_via_email: "",
  webauthn_via_sms: "",
};

type HandleFormProps = {
  handleType: HandleType;
  factors: Factor[];
  handleSubmit: (factor: Factor, handle: Handle) => void;
  validate?: Validator<string>;
  defaultValue?: string;
};

const HandleForm: React.FC<HandleFormProps> = ({
  handleType,
  factors,
  handleSubmit,
  defaultValue,
}) => {
  const filteredFactors = filterFactors(factors, handleType).filter(
    (f) => !isFactorOidc(f)
  );
  const shouldRenderFactorDropdown = filteredFactors.length > 1;
  const { registerField, registerSubmit, values, status, resetForm } =
    useForm();
  const [flag, setFlag] = useState<Flag>(GB_FLAG);
  const [factor, setFactor] = useState<Factor>(filteredFactors[0]);
  const { text } = useConfiguration();

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
            defaultValue,
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
  }, [flag, handleType, text, registerField, values, defaultValue]);

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

const TAB_NAME = {
  email: "email",
  phone: "phone",
};

type Props = {
  flowState: InitialState;
  lastHandle?: LastHandle;
};

export const Initial: React.FC<Props> = ({ flowState }) => {
  const { factors, logo, text } = useConfiguration();

  const oidcFactors: FactorOIDC[] = useMemo(
    () => factors.filter(isFactorOidc),
    [factors]
  );
  const nonOidcFactors: Factor[] = useMemo(
    () => factors.filter((f) => !isFactorOidc(f)),
    [factors]
  );

  const handleTypes = useMemo(() => {
    return getHandleTypes(factors);
  }, [factors]);

  const handleSubmit = useCallback(
    (factor: Factor, handle?: Handle) => {
      flowState.logIn({
        factor,
        handle,
      });
    },
    [flowState]
  );

  const ConfiguredForm = useMemo(() => {
    if (nonOidcFactors.length === 0) {
      return null;
    }

    if (handleTypes.length === 1) {
      return (
        <>
          <HandleForm
            handleSubmit={handleSubmit}
            factors={factors}
            handleType={handleTypes[0]}
          />
          <Divider>{text["initial.divider"]}</Divider>
        </>
      );
    }

    return (
      <>
        <Tabs
          className={sprinkles({ marginY: "6" })}
          tabs={[
            {
              id: TAB_NAME.email,
              title: text["initial.handle.email"],
              content: (
                <HandleForm
                  handleSubmit={handleSubmit}
                  factors={factors}
                  handleType="email_address"
                />
              ),
            },
            {
              id: TAB_NAME.phone,
              title: text["initial.handle.phone"],
              content: (
                <HandleForm
                  handleSubmit={handleSubmit}
                  factors={factors}
                  handleType="phone_number"
                />
              ),
            },
          ]}
        />
        <Divider>{text["initial.divider"]}</Divider>
      </>
    );
  }, [factors, handleSubmit, handleTypes, nonOidcFactors.length, text]);

  return (
    <article data-testid="sid-form-initial-state">
      <Logo logo={logo} />
      <Text
        as="h1"
        variant={{ size: "2xl-title", weight: "bold" }}
        t="initial.title"
      />
      <Text variant={{ color: "tertiary" }} as="h2" t="initial.subtitle" />
      {ConfiguredForm}
      <Oidc providers={oidcFactors} handleClick={handleSubmit} />
    </article>
  );
};
