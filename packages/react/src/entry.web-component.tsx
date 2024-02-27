import { Form } from "./components/form";
import { ConfigurationProvider } from "./context/config-context";
import { SlashIDProvider } from "./context/slash-id-context";
import "./dev.css";
import r2wc from "@r2wc/react-to-web-component"

const Example = ({
  // provider
  oid,
  tokenStorage,
  baseApiUrl,
  sdkUrl,
  themeProps,
  analyticsEnabled,

  // overides
  factors,
  text,

  // form
  onSuccess,
  onError,
}: any) => {
  return (
    <SlashIDProvider
      oid={oid}
      themeProps={themeProps}
      baseApiUrl={baseApiUrl}
      sdkUrl={sdkUrl}
      tokenStorage={tokenStorage}
      analyticsEnabled={analyticsEnabled}
    >
      <ConfigurationProvider
        factors={factors}
        text={text}
      >
        <Form
          onSuccess={onSuccess}
          onError={onError}
        />
      </ConfigurationProvider>
    </SlashIDProvider>
  )
}

const SlashIDForm = r2wc(Example, {
  props: {
    oid: "string",
    tokenStorage: "string",
    baseApiUrl: "string",
    sdkUrl: "string",
    themeProps: "json",
    analyticsEnabled: "boolean",

    // overides
    factors: "json",
    text: "json",

    // form
    onSuccess: "function",
    onError: "function",
  }
})

customElements.define("slashid-form", SlashIDForm)