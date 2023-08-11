import React from "react";
import { ThemeRoot } from "../src/components/theme-root";

/** @type { import('@storybook/react').Preview } */
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
    <ThemeRoot theme="light">
      <Story />
    </ThemeRoot>
  ),
];
