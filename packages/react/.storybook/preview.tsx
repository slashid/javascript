import React from "react";
import { SlashIDProvider } from "../src/main";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <SlashIDProvider
      // @ts-ignore
      oid={import.meta.env.VITE_ORG_ID}
      themeProps={{ theme: "auto" }}
      tokenStorage="localStorage"
      baseApiUrl="https://api.slashid.com"
    >
      <Story />
    </SlashIDProvider>
  ),
];
