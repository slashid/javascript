import { Text } from "../text";
import { InitialState } from "./flow";
import { useMemo } from "react";
import { Tabs } from "../tabs";
import { getHandleTypes } from "../../domain/handles";
import { useConfiguration } from "../../hooks/use-configuration";
import { Button } from "../button";
import { FactorOIDC, isFactorOidc } from "../../domain/types";
import { Logo as TLogo } from "../../context/config-context";
import { sprinkles } from "../../theme/sprinkles.css";

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
          Sign in with {p.options?.provider}
        </Button>
      ))}
    </div>
  );
};

type Props = {
  flowState: InitialState;
};

export const Initial: React.FC<Props> = ({ flowState }) => {
  /* const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flag, setFlag] = useState<Flag>(GB_FLAG); */
  const { factors, logo } = useConfiguration();

  const oidcProviders: FactorOIDC[] = factors.filter(isFactorOidc);

  const handleTypes = useMemo(() => {
    return getHandleTypes(factors);
  }, [factors]);

  const showTabs = handleTypes.length > 1;

  console.log({ showTabs });

  return (
    <article>
      <Logo logo={logo} />
      <Text
        as="h1"
        variant={{ size: "2xl-title", weight: "bold" }}
        t="initial.title"
      />
      <Text
        className={sprinkles({
          color: { darkMode: "contrast", lightMode: "contrast" },
        })}
        as="h2"
        t="initial.subtitle"
      />
      <form
        data-testid="sid-form-initial-state"
        onSubmit={(e) => {
          e.preventDefault();
          flowState.logIn({
            factor: {
              method: "email_link",
            },
            handle: { type: "email_address", value: "ivan@slashid.dev" },
          });
        }}
      >
        <div
          style={{
            margin: 12,
            backgroundColor: "#222131",
            width: "360px",
            padding: 8,
          }}
        >
          <h3 style={{ color: "white" }}>Tabs</h3>
          <Tabs
            tabs={[
              { id: "tab1", title: "Email", content: <p>Tab 1 Content</p> },
              { id: "tab2", title: "Phone", content: <p>Tab 2 Content</p> },
            ]}
          />
        </div>
      </form>
      <Oidc providers={oidcProviders} />
    </article>
  );
};
