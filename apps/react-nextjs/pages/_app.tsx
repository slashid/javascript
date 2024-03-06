import "../styles/globals.css";
import "demo-form/style.css";
import type { AppProps } from "next/app";
import { SlashIDProvider } from "@slashid/react";

export default function App({ Component, pageProps }: AppProps) {
  const oid = process.env.NEXT_PUBLIC_ORG_ID || "";
  return (
    <SlashIDProvider
      oid={oid}
      tokenStorage="localStorage"
      environment="sandbox"
    >
      <Component {...pageProps} />
    </SlashIDProvider>
  );
}
