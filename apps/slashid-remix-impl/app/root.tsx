import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { createSlashIDApp } from "@slashid/remix";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const { SlashIDApp, slashIDRootLoader } = createSlashIDApp(App, {
  oid: "b6f94b67-d20f-7fc3-51df-bf6e3b82683e",
});

export const loader: LoaderFunction = (args) => slashIDRootLoader(args);
export default () => (
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
        <Scripts />
        <LiveReload />
      </SlashIDApp>
    </body>
  </html>
);
