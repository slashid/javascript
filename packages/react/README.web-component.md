## Usage

The SlashID form is available as a custom element: `<slashid-form>`.

There are two files which need to be included in your HTML document:

1. `main.js`
2. `style.css`

By nature of being a custom element, props follow the HTML specification so they must be strings.

To work around this limitation:

- Provide boolean and number props as string, they're later parsed to their respective type.
- Provide array and object props as stringified JSON, they will be parsed with `JSON.parse()` later.
- Provide function props by first defining the function on `globalThis`, then providing the function name to the prop as a string.

Props are reactive, but keep in mind that reference checks for array and object types are not possible since they are stringified. Function references are not reactive, redefine the function on `globalThis` and provide the new name to the prop to achieve reactivity.

### Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <title>Hello world</title>
  </head>
  <body>
    <script>
      function sidOnSuccess() {
        alert("Success!");
      }
    </script>

    <slashid-form
      factors='[{ "method": "email_link" }]'
      oid="YOUR_ORG_ID"
      base-api-url="https://api.slashid.com"
      token-storage="memory"
      on-success="sidOnSuccess"
      analytics-enabled="true"
    ></slashid-form>

    <script type="module" src="main.js"></script>
  </body>
</html>
```

## Props

| Name                | Type                                                                                                                                                                   | Default                                                                                                                                           | Description                                                                                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| oid                 | `string`                                                                                                                                                               |                                                                                                                                                   | The organization ID you get when signing up with /id                                                                                                                                                                                          |
| initialToken?       | `string`                                                                                                                                                               |                                                                                                                                                   | Given a valid initial token, SDK will initialize with a `User` based on that token                                                                                                                                                            |
| tokenStorage?       | `"memory" \| "localStorage"`                                                                                                                                           | `"memory"`                                                                                                                                        | Where SlashID user tokens are stored. Set to `"localStorage"` to enable persistence.                                                                                                                                                          |
| environment?        | `"production" \| "sandbox"`                                                                                                                                            | `"production"`                                                                                                                                    | The SlashID environment you wish to interact with to                                                                                                                                                                                          |
| analyticsEnabled?   | `boolean`                                                                                                                                                              | `true`                                                                                                                                            | Enable collection of client side analytics events                                                                                                                                                                                             |
| themeProps?         | `{ theme?: Theme, className?: string}`                                                                                                                                 | `{ theme: "auto" }`                                                                                                                               | Set the UI theme (`auto`, `light` or `dark`) and apply a CSS class name to the theme root                                                                                                                                                     |
| logo?               | `string`                                                                                                                                                               | Defaults to SlashID logo                                                                                                                          | The logo shown in the SlashID components, must be URL.                                                                                                                                                                                        |
| text?               | `Record<string, string>`                                                                                                                                               | See [default](https://developer.slashid.dev/docs/access/react-sdk/reference/components/react-sdk-reference-configurationprovider#text-overrides). | Overrides for text shown in the SlashID components.                                                                                                                                                                                           |
| factors?            | [`FactorConfiguration[]`](https://developer.slashid.dev/docs/access/react-sdk/reference/components/react-sdk-reference-configurationprovider#type-factorconfiguration) | `[{ method: "webauthn" }, { method: "email_link" }]`                                                                                              | The [authentication methods](https://developer.slashid.dev/docs/access/sdk/interfaces/Types.Factor) to be used.                                                                                                                               |
| storeLastHandle?    | `boolean`                                                                                                                                                              | `false`                                                                                                                                           | Flag where `true` means the handle type and value used in a successful log in action will be persisted in `window.localStorage`.                                                                                                              |
| defaultCountryCode? | `string`                                                                                                                                                               | `US`                                                                                                                                              | Default country code to be used for the phone number input. Accepts an Alpha-2 ISO-3166 country code.                                                                                                                                         |
| onSuccess?          | `(user: User) => void`                                                                                                                                                 |                                                                                                                                                   | Callback function that gets called with a User object returned from core SDK upon successful log in action. Note: callback functions must be defined in `globalThis`, this prop accepts the function name as `string`.                        |
| onError?            | `(error: Error, context: ErrorContext) => void`                                                                                                                        |                                                                                                                                                   | Callback function that gets called with a User object returned from core SDK upon log in action failure. Note: callback functions must be defined in `globalThis`, this prop accepts the function name as `string`.                           |
| middleware?         | [`LoginMiddleware`](https://developer.slashid.dev/docs/access/react-sdk/reference/middleware/react-sdk-reference-login-middleware)                                     |                                                                                                                                                   | Effects to be run post-login but before `onSuccess` fires, and before the next render cycle. See [`LoginMiddleware`](https://developer.slashid.dev/docs/access/react-sdk/reference/middleware/react-sdk-reference-login-middleware) for more. |

## How does this work?

We are using [Web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) as an interopability interface only.

Internally, we mount a React app with three components from `@slashid/react`:

- `<SlashIDProvider>`
- `<ConfigurationProvider>`
- `<Form>`

The available props are a subset of those available in `@slashid/react`.
