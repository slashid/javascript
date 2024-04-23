import "../styles/globals.css";
import "demo-form/style.css";
import type { AppProps } from "next/app";
import { SlashIDProvider } from "@slashid/react";

export default function App({ Component, pageProps }: AppProps) {
  const oid = process.env.NEXT_PUBLIC_ORG_ID || "";
  const urls = {
    ...(process.env.NEXT_PUBLIC_API_URL
      ? {
          baseApiUrl: process.env.NEXT_PUBLIC_API_URL,
          sdkUrl: process.env.NEXT_PUBLIC_SDK_URL,
        }
      : { environment: "sandbox" }),
  };
  return (
    /* @ts-expect-error TODO export the environments */
    <SlashIDProvider oid={oid} tokenStorage="localStorage" {...urls}>
      <Component {...pageProps} />
    </SlashIDProvider>
  );
}
