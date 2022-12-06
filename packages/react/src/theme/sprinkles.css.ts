import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";
import { publicVariables } from "./theme.css";

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

export const sprinkles = createSprinkles(colorProperties);
export type Sprinkles = Parameters<typeof sprinkles>[0];
