![SlashID React SDK](https://raw.githubusercontent.com/slashid/javascript/main/packages/react/slashid_react_banner.png)

![npm](https://img.shields.io/npm/v/@slashid/remix)
![build](https://github.com/slashid/javascript/actions/workflows/ci.yml/badge.svg)

## Documentation

Check out our [developer docs](https://developer.slashid.dev/) for guides and API documentation. You can also check out the demo on CodeSandbox:

[![Try on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/hopeful-austin-486cco?fontsize=14&hidenavigation=1&theme=dark)

## Setup

### Prerequisites

Your organization needs to [sign up](https://slashid.dev/request-access) with `/id` to get access to the core SDK and an organization ID.

Your environment should have the following dependencies installed:

- `node.js` => `v16+`
- `react` => `v16+`
- `@slashid/slashid` => `v1.8+`

### Installation

After obtaining your organization ID, install the package:

```
npm install @slashid/remix
```

## WIP Implementation

### High-level

- We have a remix lib `@slashid/remix`
- We have a test bed for the lib `apps/slashid-remix-impl`
- You can log in and out!
- The user token is set in the root loader, and _should_ be available in other loaders.
- Cookie storage works

### `packages/@slashid/react`

- Add `CookieStorage` for js token storage in `@slashid/react`
- Login works with cookie storage

### `packages/@slashid/remix`

- Create package
- Add build (remix doesn't support `.ts` or `.tsx` out of the box)
- Remix native `SlashIDProvider`
  - `tokenStorage` defaults to `cookie`, is not configurable. In future this would be extended to support `http-only-cookie`
  - Has better defaults for sdk and api urls (production). I think this is an important stumbling block to remove as part of remix onboarding.
- Add `SlashIDApp` and `rootAuthLoader`
  - Implements `SlashIDProvider`
  - Can parse cookie from request (`rootAuthLoader`)

### `apps/slashid-remix-impl`

- Implements `@slashid/remix`
- There is a "protected page" and an "unprotected page"
  - The protected page is not protected yet, but all the boilerplate is done

## Not done

1. I haven't worked out exactly what things need to be re-exported through `@slashid/remix` yet
1. CSS is currently not re-exported through `@slashid/remix`, this is a pain point because it's the only reason so far that installing `@slashid/react` is necessary.
1. Token is parsed from cookie but it is not yet validated. We can do this with JWKS or User.validateToken(), but I've done neither.
1. The root loader does not fully support the second overload I created, which allows users to have their own root loader in addition to ours.
1. Logging in via DirectID can only be done client side, as it takes an API call to resolve the challenge and we only have a single render cycle server side. If both a cookie and direct ID are present, we prefer the direct ID.

# How to use `@slashid/remix`

This is some high-level points about how the library works from a user POV

## 1. Install `@slashid/remix`

```
npm i @slashid/remix
```

## 2. Set up the root auth loader

```tsx
// root.tsx
import { rootAuthLoader } from "@slashid/remix";

export const loader: LoaderFunction = (args) => rootAuthLoader(args);
```

## 3. Wrap your app in `SlashIDApp`, set your org id

```tsx
// root.tsx
import { SlashIDApp } from "@slashid/remix";

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

export default SlashIDApp(App, { oid: "YOUR_ORG_ID" });
```

## 4. Add (one of) the slashid libraries to server deps, for CSS

Without this it doens't get bundled for SSR, this seems like a point where people will trip

```js
// remix.config.js
export default {
  //  ...
  serverDependenciesToBundle: ["@slashid/react"],
};
```

## 5. Implement the form with control components + import css

This isn't the best DX, I think ideally there is a straightforward way to redirect people to a dedicated login page when auth is missing instead of using these control components.

```tsx
import "@slashid/react/style.css";
import {
  ConfigurationProvider,
  Form,
  LoggedIn,
  LoggedOut,
  type Factor,
  useSlashID,
} from "@slashid/remix";

const factors: Factor[] = [{ method: "email_link" }];

export default function Index() {
  return (
    <>
      <LoggedIn>
        You are logged in
        <button onClick={logOut}>Log out</button>
      </LoggedIn>
      <LoggedOut>
        You are logged out
        <div style={{ width: "500px" }}>
          <ConfigurationProvider factors={factors}>
            <Form />
          </ConfigurationProvider>
        </div>
      </LoggedOut>
    </>
  );
}
```

## 6. Protect the routes

If you want to restrict access to a route, use the `getUserFromRequest` helper. This will return `undefined` if the user is not logged in, or the user object if they are.

```ts
import { getUserFromRequest } from "@slashid/remix";

export const loader: LoaderFunction = (args) => {
  const user = getUserFromRequest(args);
  if (!user) {
    return redirect("/login");
  }
  return json({ user });
};
```

## 7. (Optional) Extend the root loader with your own loader code

_This is not fully implemented yet_

Note: you might choose to drop this for the MVP, but it felt quite important to me because without it people cannot have a root loader which seems a common pattern.

```jsx
// root.tsx

export const loader: LoaderFunction = (args) =>
  rootAuthLoader(args, (argsWithSlashID) => {
    // loader code goes here
    // argsWithSlashID.slashid is user token, or some hook works here?
  });
```
