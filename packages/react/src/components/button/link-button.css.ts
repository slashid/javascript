import { style, styleVariants } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const base = style({
  fontFamily: publicVariables.font.fontFamily,
  fontWeight: theme.font.weight.semibold,
  fontSize: theme.font.size.sm,
  color: publicVariables.color.foreground,

  display: "flex",
  padding: "0",
  backgroundColor: "transparent",
  userSelect: "none",
  lineHeight: "118%",
  border: "none",

  ":hover": {
    cursor: "pointer",
  },

  ":active": {
    transform: "scale(.98)",
  },
});

export const variants = styleVariants({
  base: [base],
  back: [
    base,
    {
      color: publicVariables.color.tertiary,

      ":hover": {
        color: publicVariables.color.foreground,
      },
    },
  ],
});

export type Variants = keyof typeof variants;
