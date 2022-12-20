import { style } from "@vanilla-extract/css";
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
    marginLeft: theme.space,
    marginRight: theme.space,
  },
  shorthands: {
    marginY: ["marginTop", "marginBottom"],
    marginX: ["marginLeft", "marginRight"],
  },
});

export const stack = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
});

export const centered = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const sprinkles = createSprinkles(colorProperties, space);
export type Sprinkles = Parameters<typeof sprinkles>[0];
