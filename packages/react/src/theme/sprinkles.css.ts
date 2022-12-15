import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";
import { publicVariables, theme } from "./theme.css";

const colorProperties = defineProperties({
  conditions: {
    lightMode: {
      "@media": "(prefers-color-scheme: light)",
    },
    darkMode: { "@media": "(prefers-color-scheme: dark)" },
  },
  defaultCondition: "lightMode",
  properties: {
    color: publicVariables.color,
    backgroundColor: publicVariables.color,
  },
});

const space = defineProperties({
  properties: {
    marginTop: theme.space,
    marginBottom: theme.space,
  },
  shorthands: {
    marginY: ["marginTop", "marginBottom"],
  },
});

export const sprinkles = createSprinkles(colorProperties, space);
export type Sprinkles = Parameters<typeof sprinkles>[0];
