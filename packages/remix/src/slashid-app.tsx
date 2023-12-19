/* eslint-disable react/display-name */
import { useLoaderData } from "@remix-run/react";
import {
  RemixSlashIDProviderOptions,
  SlashIDProvider,
} from "./slashid-provider";
import { RootAuthLoader } from "./root-auth-loader";

type SlashIDAppOptions = Omit<
  RemixSlashIDProviderOptions,
  "children" | "initialToken"
>;

export function Wrapper({
  children,
  options,
}: {
  children: React.ReactNode;
  options: SlashIDAppOptions;
}) {
  const data = useLoaderData<RootAuthLoader>();

  console.log("root loader response", data);

  const { slashid } = data;

  return (
    <SlashIDProvider
      baseApiUrl="https://api.slashid.com"
      sdkUrl="https://cdn.slashid.com/sdk.html"
      initialToken={slashid}
      {...options}
    >
      {children}
    </SlashIDProvider>
  );
}

export function SlashIDApp(App: () => JSX.Element, options: SlashIDAppOptions) {
  return () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const data = useLoaderData<RootAuthLoader>();

    console.log("root loader response", data);

    const { slashid } = data;

    return (
      <SlashIDProvider
        baseApiUrl="https://api.slashid.com"
        sdkUrl="https://cdn.slashid.com/sdk.html"
        initialToken={slashid}
        {...options}
      >
        <App />
      </SlashIDProvider>
    );
  };
}
