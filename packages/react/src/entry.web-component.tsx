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

type SlashIDFormInternalProps = Pick<
  SlashIDProviderProps,
  | "oid"
  | "initialToken"
  | "tokenStorage"
  | "baseApiUrl"
  | "sdkUrl"
  | "analyticsEnabled"
  | "themeProps"
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
  baseApiUrl,
  sdkUrl,
  analyticsEnabled,
  themeProps,

  // overides
  logo,
  factors,
  text,
  storeLastHandle,
  defaultCountryCode,

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
        baseApiUrl={baseApiUrl}
        sdkUrl={sdkUrl}
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
            <>
              {slotSuccessIndeterminate && (
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
              )}
            </>
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
    baseApiUrl: "string",
    sdkUrl: "string",
    analyticsEnabled: "boolean",
    themeProps: "json",

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
