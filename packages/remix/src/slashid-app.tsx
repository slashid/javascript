/* eslint-disable react/display-name */
import { useLoaderData } from "@remix-run/react";
import {
  RemixSlashIDProviderOptions,
  SlashIDProvider,
} from "./slashid-provider";
import { RootLoader, rootAuthLoader } from "./root-auth-loader";
import { LoaderFunctionArgs, LoaderFunction } from "@remix-run/server-runtime";

type SlashIDAppOptions = Omit<
  RemixSlashIDProviderOptions,
  "children" | "initialToken"
>;

function Wrapper({
  children,
  options,
}: {
  children: React.ReactNode;
  options: SlashIDAppOptions;
}) {
  const { slashid } = useLoaderData<RootLoader>();

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

export const createSlashIDApp = (
  App: () => JSX.Element,
  options: SlashIDAppOptions
) => {
  const opts = {
    baseApiUrl: "https://api.slashid.com",
    sdkUrl: "https://cdn.slashid.com/sdk.html",
    ...options,
  };

  const SlashIDApp = ({ children }: any) => (
    <Wrapper options={options}>
      {children}
    </Wrapper>
  );

  // @ts-ignore
  const slashIDRootLoader: RootLoader = async (
    args: LoaderFunctionArgs,
    callback: any
  ): Promise<ReturnType<LoaderFunction>> => {
    const argsWithSid = Object.assign(args, {
      sid: { baseApiUrl: opts.baseApiUrl, oid: opts.oid },
    });

    return rootAuthLoader(argsWithSid, callback);
  };

  return {
    SlashIDApp,
    slashIDRootLoader,
  };
};
