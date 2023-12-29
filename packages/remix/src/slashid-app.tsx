/* eslint-disable react/display-name */
import { useLoaderData } from "@remix-run/react";
import {
  RemixSlashIDProviderOptions,
  SlashIDProvider,
} from "./slashid-provider";
import { rootLoader } from "./root-loader";
import { LoaderFunctionArgs, type LoaderFunction } from "@remix-run/server-runtime";
import { getUserTokenFromCookies } from "./util";
import { SSR } from "@slashid/slashid";

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
  const out = useLoaderData();

  const { slashid } = out as unknown as { slashid?: string }

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

  const createSlashIDRootLoader = () => {
    const context = {
      baseApiUrl: opts.baseApiUrl,
      sdkUrl: opts.sdkUrl,
      analyticsEnabled: opts.analyticsEnabled,
      oid: opts.oid
    }
    return rootLoader(context);
  };

  const slashIDLoader = (loader: LoaderFunction) => (args: LoaderFunctionArgs) => {
    const cookies = args.request.headers.get("cookie");
    const token = getUserTokenFromCookies(cookies);

    if (!token) return loader(args)

    return loader({
      ...args,
      context: {
        ...args.context,
        user: new SSR.User(token, {
          baseURL: opts.baseApiUrl,
          sdkURL: opts.sdkUrl,
          oid: opts.oid,
          analyticsEnabled: opts.analyticsEnabled,
        })
      }
    })
  }

  return {
    SlashIDApp,
    slashIDRootLoader: createSlashIDRootLoader(),
    slashIDLoader
  };
};
