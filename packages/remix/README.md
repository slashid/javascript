![SlashID Remix SDK](./banner.png)

![npm](https://img.shields.io/npm/v/@slashid/remix)
![build](https://github.com/slashid/javascript/actions/workflows/ci.yml/badge.svg)

## Documentation

Check out our [developer docs](https://developer.slashid.dev/) for guides and API documentation.

## Setup

### Prerequisites

You will need to [sign up to SlashID](https://console.slashid.dev/) and create an organization, once you've complete this you'll find your organization ID in [Settings -> General](https://console.slashid.dev/settings/general).

Your environment should have the following dependencies installed:
- `node.js` => `>=20.x.x`
- `react` => `>=18.x.x`

### Quick start

#### 1. Install `@slashid/remix`
Once you have a Remix application ready to go, you need to install the SlashID Remix SDK. This SDK provides a prebuilt log-in & sign-up form, control components and hooks - tailor made for Remix.
```
npm install @slashid/remix
```

#### 2. Create SlashID app primitives
In your Remix application create a file `app/slashid.ts`.

In this file create the SlashID application primitives and re-export them, you'll use them later.
```ts
// app/slashid.ts

import { createSlashIDApp } from '@slashid/remix'

export const {
  SlashIDApp,
  slashIDRootLoader,
  slashIDLoader
} = createSlashIDApp({ oid: "YOUR_ORGANIZATION_ID" });

```
Tip: `oid` is your organization ID, you can find it in the [SlashID console](https://console.slashid.dev/) under [Settings -> General](https://console.slashid.dev/settings/general).

#### 3. Configure `slashIDRootLoader`
To configure SlashID in your Remix application you'll need to update your root loader. With a small change you'll have easy access to authentication in all of your Remix routes.

Import the `slashIDRootLoader` you created in the previous step, invoke it and export it as `loader`.

```tsx
// root.ts

import { LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { slashIDRootLoader } from "~/slashid";
 
export const loader: LoaderFunction = slashIDRootLoader();
 
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

If you need to load additional data via the root loader, you can simply pass a loader function to `slashIDRootLoader`. You can even check for authentication right here in the root loader.

```ts
// root.ts

import { slashIDRootLoader } from "~/slashid"
import { getUser } from '@slashid/remix'

export const loader: LoaderFunction = slashIDRootLoader((args) => {
  const user = getUser(args)

  if (user) {
    // the user is logged in
  }

  // fetch data

  return {
    hello: "world!" // your data
  }
});
```

#### 4. Wrap your application body with `<SlashIDApp>`
In step 2 you created `SlashIDApp`, it provides authentication state to your React component tree. There is no configuration, just add it to your Remix application.

```tsx
// root.tsx

import { SlashIDApp } from '~/slashid'

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
        {/* Wrap the contents of your <body> with SlashIDApp */}
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
```

#### 5. Create your log-in/sign-up page
SlashID offers a prebuilt form that works for both log-in and sign-up. Users with an account can log-in here and users without one need to simply complete the form to create their account.

```tsx
// routes/login.tsx

import {
  ConfigurationProvider,
  Form,
  type Factor,
} from "@slashid/remix";

const factors: Factor[] = [
  { method: "email_link" }
];

export default function LogIn() {
  return (
    <div style={{ width: "500px" }}>
      <ConfigurationProvider factors={factors}>
        <Form />
      </ConfigurationProvider>
    </div>
  );
}
```
#### 6. Protecting your pages

##### Server side
To protect your routes you can use the `slashIDLoader` you created in step 2. This utility is a wrapper for your loaders that provides authentication state to your loader code.

You'll check if the user exists, and if not redirect them to the login page.

The `useSlashID()` hook provides authentication state & helper functions to your React code, here you'll implement `logOut` too.

```tsx
// routes/_index.tsx

import { slashIDLoader } from '~/slashid'
import { getUser, useSlashID } from '@slashid/remix'
 
export const loader = slashIDLoader((args) => {
  const user = getUser(args)

  if (!user) {
    return redirect("login")
  }

  return {}
})

export default function Index() {
  const { logOut } = useSlashID()

  return (
    <div>
      <h1>Index</h1>
      <p>You are logged in!</p>
      <button onClick={logOut}>
        Log out
      </button>
    </div>
  )
}
```

##### Client side
SlashID has several [Control Components](https://developer.slashid.dev/docs/access/react-sdk/reference/components/react-sdk-reference-loggedin) that allow you to conditionally show or hide content based on the users authentication state.

You'll implement `<LoggedIn>`, `<LoggedOut>`, and provide the option to log-out by implementing the `logOut` helper function from the `useSlashID()` hook.

```tsx
// routes/_index.tsx

import { LoggedIn, LoggedOut, useSlashID } from '@slashid/remix'
import { useNavigate } from "@remix-run/react";

export default function Index() {
  const { logOut } = useSlashID()
  const navigate = useNavigate();

  return (
    <div>
      <LoggedIn>
        You are logged in!
        <button onClick={logOut}>
          Log out
        </button>
      </LoggedIn>
      <LoggedOut>
        {navigate("login")}
      </LoggedOut>
    </div>
  )
}
```
