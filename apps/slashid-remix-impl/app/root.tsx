import { Wrapper, rootAuthLoader } from "@slashid/remix";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Wrapper options={{ oid: "b6f94b67-d20f-7fc3-51df-bf6e3b82683e" }}>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Wrapper>
      </body>
    </html>
  );
}

// export default SlashIDApp(App, { oid: "b6f94b67-d20f-7fc3-51df-bf6e3b82683e" })
