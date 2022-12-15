import { useCallback, useMemo, useState } from "react";
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
} from "../../domain/types";
import { Logo as TLogo } from "../../context/config-context";
import * as styles from "./initial.css";
import { sprinkles } from "../../theme/sprinkles.css";
import { Factor } from "@slashid/slashid";
import { Dropdown } from "../dropdown";
import { Flag, GB_FLAG, Input, PhoneInput } from "../input";

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

type OidcProps = {
  providers: FactorOIDC[];
};

const Oidc: React.FC<OidcProps> = ({ providers }) => {
  const { text } = useConfiguration();
  if (!providers.length) {
    return null;
  }

  return (
    <div>
      {providers.map((p) => (
        <Button
          key={p.options?.provider}
          onClick={() => console.log({ p })}
          variant="secondary"
        >
          {text["initial.oidc"]}
          <span className={styles.oidcProvider}>{p.options?.provider}</span>
        </Button>
      ))}
    </div>
  );
};

type HandleFormProps = {
  handleType: HandleType;
  factors: Factor[];
  handleSubmit: (factor: Factor, handle: Handle) => void;
};

const HandleForm: React.FC<HandleFormProps> = ({
  handleType,
  factors,
  handleSubmit,
}) => {
  const filteredFactors = filterFactors(factors, handleType).filter(
    (f) => !isFactorOidc(f)
  );
  const shouldRenderFactorDropdown = filterFactors.length > 1;
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flag, setFlag] = useState<Flag>(GB_FLAG);
  const [factor, setFactor] = useState<Factor>(filteredFactors[0]);
  const { text } = useConfiguration();

  const input = useMemo(() => {
    if (handleType === "phone_number") {
      return (
        <PhoneInput
          id={`sid-input-${handleType}`}
          name={handleType}
          label={text["initial.handle.email"]}
          placeholder={text["initial.handle.phone.placeholder"]}
          value={phone}
          flag={flag}
          onChange={setPhone}
          onFlagChange={setFlag}
        />
      );
    }

    return (
      <Input
        id={`sid-input-${handleType}`}
        name={handleType}
        label={text["initial.handle.email"]}
        placeholder={text["initial.handle.phone.email"]}
        value={email}
        onChange={setEmail}
      />
    );
  }, [email, flag, handleType, phone, text]);

  // TODO
  // validation
  // submit button
  // on submit needs to call the provided callback
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(factor, {
          type: handleType,
          value: "ivan@slashid.dev",
        });
      }}
    >
      {shouldRenderFactorDropdown && (
        <Dropdown
          defaultValue={filteredFactors[0].method}
          className={sprinkles({ marginBottom: "3", marginTop: "5" })}
          label={text["initial.authenticationMethod"]}
          items={filteredFactors.map((f) => ({
            label: f.method,
            value: f.method,
          }))}
          onChange={(method) =>
            setFactor(factors.find((f) => f.method === method)!)
          }
        />
      )}
      {input}
    </form>
  );
};

const TAB_NAME = {
  email: "email",
  phone: "phone",
};

type Props = {
  flowState: InitialState;
};

export const Initial: React.FC<Props> = ({ flowState }) => {
  const { factors, logo, text } = useConfiguration();

  const oidcProviders: FactorOIDC[] = factors.filter(isFactorOidc);

  const handleTypes = useMemo(() => {
    return getHandleTypes(factors);
  }, [factors]);

  const handleSubmit = useCallback(
    (factor: Factor, handle: Handle) => {
      flowState.logIn({
        factor,
        handle,
      });
    },
    [flowState]
  );

  const ConfiguredForm = useMemo(() => {
    const showTabs = handleTypes.length > 1;

    if (!showTabs) {
      return (
        <HandleForm
          handleSubmit={handleSubmit}
          factors={factors}
          handleType={handleTypes[0]}
        />
      );
    }

    return (
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
    );
  }, [factors, handleSubmit, handleTypes, text]);

  return (
    <article data-testid="sid-form-initial-state">
      <Logo logo={logo} />
      <Text
        as="h1"
        variant={{ size: "2xl-title", weight: "bold" }}
        t="initial.title"
      />
      <Text className={styles.subtitle} as="h2" t="initial.subtitle" />
      {ConfiguredForm}
      <Oidc providers={oidcProviders} />
    </article>
  );
};
