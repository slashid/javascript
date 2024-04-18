import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { getConfigFromEnv } from "./config";
import { createSlashIDApp, getUser } from "@slashid/remix";
import { useMemo } from "react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = (args: LoaderFunctionArgs) => {
  const user = getUser(args);

  return {
    user,
    config: getConfigFromEnv(),
  };
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  const SlashIDApp = useMemo(() => {
    const { SlashIDApp } = createSlashIDApp({
      oid: data.config.oid,
      baseApiUrl: data.config.baseApiUrl,
      sdkUrl: data.config.sdkUrl,
    });

    return SlashIDApp;
  }, [data.config.baseApiUrl, data.config.oid, data.config.sdkUrl]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <SlashIDApp>
          <Outlet />
          <ScrollRestoration />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.env = ${JSON.stringify(data.config)}`,
            }}
          />
          <Scripts />
          <LiveReload />
        </SlashIDApp>
      </body>
    </html>
  );
}
