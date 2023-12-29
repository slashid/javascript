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
import { SlashIDApp, slashIDRootLoader } from "./slashid";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader: LoaderFunction = slashIDRootLoader();
// (args: LoaderFunctionArgs) => {
//   console.log('root loader', args)

//   const user = getUser(args)

//   return {
//     hello: "world" + " (" + (user ? "logged in" : "logged out") + ")"
//   }
// });

export default function App() {
  const { hello } = useLoaderData<{ hello: string }>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        hello: {hello}
        <SlashIDApp>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </SlashIDApp>
      </body>
    </html>
  );
}
