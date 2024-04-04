import { Form, type FormProps } from "./components/form";
import {
  ConfigurationProvider,
  type IConfigurationContext,
} from "./context/config-context";
import {
  SlashIDProvider,
  type SlashIDProviderProps,
} from "./context/slash-id-context";
import "./dev.css";
import r2wc from "@r2wc/react-to-web-component";
import { Text } from "./components/text";
import { Loader } from "./components/form/authenticating/icons";
import { Slot } from "./components/slot";
import { SlashID } from "../../react-primitives/src/components/icon";

type SlashIDFormInternalProps = Pick<
  SlashIDProviderProps,
  | "oid"
  | "initialToken"
  | "tokenStorage"
  | "analyticsEnabled"
  | "themeProps"
  | "environment"
> &
  Pick<
    IConfigurationContext,
    "logo" | "factors" | "text" | "storeLastHandle" | "defaultCountryCode"
  > &
  Pick<FormProps, "onSuccess" | "onError" | "middleware"> & {
    slotSuccessIndeterminate: boolean;
  };

const SlashIDFormInternal = ({
  // provider
  oid,
  initialToken,
  tokenStorage,
  environment,
  analyticsEnabled,
  themeProps,

  // overides
  logo = <SlashID />,
  factors,
  text,
  storeLastHandle,
  defaultCountryCode = "US",

  // form
  onSuccess,
  onError,
  middleware,

  // slots
  slotSuccessIndeterminate,
}: SlashIDFormInternalProps) => {
  return (
    <div style={{ width: "440px", display: "block" }}>
      <SlashIDProvider
        oid={oid}
        initialToken={initialToken}
        themeProps={themeProps}
        environment={environment}
        tokenStorage={tokenStorage}
        analyticsEnabled={analyticsEnabled}
      >
        <ConfigurationProvider
          logo={logo}
          factors={factors}
          text={text}
          storeLastHandle={storeLastHandle}
          defaultCountryCode={defaultCountryCode}
        >
          <Form onSuccess={onSuccess} onError={onError} middleware={middleware}>
            {slotSuccessIndeterminate ? (
              <Slot name="success">
                <article data-testid="sid-form-success-state">
                  <Text
                    as="h1"
                    t="success.title"
                    variant={{ size: "2xl-title", weight: "bold" }}
                  />
                  <Text
                    as="h2"
                    t="success.subtitle"
                    variant={{ color: "contrast", weight: "semibold" }}
                  />
                  <Loader />
                </article>
              </Slot>
            ) : undefined}
          </Form>
        </ConfigurationProvider>
      </SlashIDProvider>
    </div>
  );
};

const SlashIDForm = r2wc(SlashIDFormInternal, {
  props: {
    // slashid provider
    oid: "string",
    initialToken: "string",
    tokenStorage: "string",
    analyticsEnabled: "boolean",
    themeProps: "json",
    environment: "string",

    // config provider
    logo: "string",
    text: "json",
    factors: "json",
    storeLastHandle: "boolean",
    defaultCountryCode: "string",

    // form
    onSuccess: "function",
    onError: "function",
    middleware: "function",

    // slots
    slotSuccessIndeterminate: "boolean",
  },
});

customElements.define("slashid-form", SlashIDForm);
