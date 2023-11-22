![SlashID React SDK](https://raw.githubusercontent.com/slashid/javascript/main/packages/react/slashid_react_banner.png)

![npm](https://img.shields.io/npm/v/@slashid/react)
![build](https://github.com/slashid/javascript/actions/workflows/ci.yml/badge.svg)

# @slashid/react-primitives

Internal package with UI primitives for React.

## Setup

This package is only available in the `slashid/javascript` monorepo as an internal package. It is not published to npm.
To install it, add it to the relevant `package.json`:

```
"@slashid/react-primitives": "workspace:*"
```

## Build

This library uses [vanilla-extract](https://vanilla-extract.style/) to implement type safe stylesheets. There is no build process involved, as the consuming app will import the source files and then build the styles accordingly. Check the [vanilla-extract integration docs](https://vanilla-extract.style/documentation/integrations/vite/) for more information.

## Components

The public interface is defined by the exports in the `src/main.ts` file. Consuming apps can import them from the package root - `import * from '@slashid/react-primitives'`.
Below we outline the common steps to use the components.

### Theme

The first thing to do is to wrap the consuming app with the `<ThemeRoot>` component. This will set up the CSS variables necessary for the components to work.

### Text customisation & translations

We expose text related components and utilities with two goals in mind:

- having a consistent text style across the app
- making it easy to replace the built-in text with custom strings, enabling i18n

In order to do that, a couple of steps are required as outlined in the following sections.

#### Text config

Text config is a record with string keys pointing to string values. These are app specific, so the library does not come with any strings that are built in. Instead, the consuming app is responsible for providing the configuration in that shape:

```ts
export const textConfig = {
  "text.hello": "Hello",
  "text.world": "World",
};

export type TextConfig = typeof textConfig;
```

#### Wrapping the app with <TextProvider>

The text config we created in the previous section needs to be passed to the `<TextProvider>` that acts as a wrapper for the app, making the config available to the text components.

```jsx
import { TextProvider } from "@slashid/react-primitives";
import { textConfig } from "./text";

export function App({ children }) {
  return <TextProvider text={textConfig}>{children}</TextProvider>;
}
```

#### Using the <Text> component

Since the library does not know about the text config specific to the app, we need to specify the type of the text config to be used to get type safety. This is done by creating a type alias for the text config and creating a wrapper for the `<Text>` component that uses it:

```jsx
import { Text as BaseText, TextProps } from "@slashid/react-primitives";
import { TextConfig } from "./text";

type Props = TextProps<TextConfig>;

export const Text: React.FC<Props> = (props) => {
  return <BaseText {...props} />;
};
```
