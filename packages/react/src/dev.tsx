import "./dev.css";
import {
  ConfigurationProvider,
  Form,
  // LoggedIn,
  // LoggedOut,
  // SlashIDLoaded,
  SlashIDProvider,
} from "./main";
// import { type FormProps } from './components/form/index'
import r2wc from "@r2wc/react-to-web-component"

// { method: "webauthn" },
//   { method: "email_link" },
//   { method: "otp_via_email" },
//   { method: "otp_via_sms" },

// const BasicForm = ({ factors }: any) => {
//   return (
//     <ConfigurationProvider
//       factors={factors}
//     >
//       <SlashIDLoaded>
//         <>
//           <LoggedIn>Logged in!</LoggedIn>
//           <LoggedOut>
//             <Form
//               onError={(error, context) =>
//                 console.log("onError", { error, context })
//               }
//             />
//           </LoggedOut>
//         </>
//       </SlashIDLoaded>
//     </ConfigurationProvider>
//   );
// };

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