![SlashID React SDK](https://raw.githubusercontent.com/slashid/javascript/main/packages/react/slashid_react_banner.png)

![npm](https://img.shields.io/npm/v/@slashid/react)
![build](https://github.com/slashid/javascript/actions/workflows/ci.yml/badge.svg)
## Documentation

Check out our [developer docs](https://developer.slashid.dev/) for guides and API documentation.

## Setup

### Prerequisites

Your organization needs to [sign up](https://slashid.dev/request-access) with `/id` to get access to the core SDK and an organization ID.

Your environment should have the following dependencies installed:

- `node.js` => `v16+`
- `react` => `v16+`
- `@slashid/slashid` => `v1.8+`

### Installation

After obtaining your organization ID, log in to `npm` and install the package:

```
npm install @slashid/react
```

### Basic Usage

Primary way of communicating with the `/id` APIs is by using the provided `useSlashID` hook. In order to do so, your app needs to be wrapped in the `SlashIDProvider`. This provider requires you to pass in the organization ID you received from `/id` as the value of the `oid` prop.

```jsx
import { SlashIDProvider } from "@slashid/react";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider oid="ORGANIZATION_ID">
      <App />
    </SlashIDProvider>
  </React.StrictMode>
);

function App() {
    const { user, logIn } = useSlashID();

    return (
      <>
        <button
          onClick={() =>
            logIn({
              handle: {
                type: "email_address",
                value: "example@email.com",
              },
              factor: { method: "email_link" },
            })
          }
        >
          Log in
        </button>
        <div>
          <code>{user}</code>
        </div>
      </>
  );
}
```

Once the `logIn` function resolves, your component will render again with the newly logged-in `user` object.
