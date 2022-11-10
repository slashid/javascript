import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SlashIDProvider } from "@slashid/react";

export default function App({ Component, pageProps }: AppProps) {
  const oid = process.env.NEXT_PUBLIC_ORG_ID || "";
  return (
    <SlashIDProvider oid={oid} tokenStorage="memory">
      <Component {...pageProps} />
    </SlashIDProvider>
  );
}
