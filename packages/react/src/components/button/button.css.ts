import { publicVariables, theme } from "../../theme/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

const base = style({
  fontFamily: publicVariables.font.fontFamily,
  borderRadius: publicVariables.border.radius,
  fontWeight: theme.font.weight.medium,
  fontSize: theme.font.size.base,
  height: theme.input.height,

  display: "flex",
  alignItems: "center",
  padding: "19px 22px",
  userSelect: "none",
  lineHeight: "118%",

  ":hover": {
    cursor: "pointer",
  },

  ":active": {
    transform: "scale(.98)",
  },

  ":focus-visible": {
    outline: `4px solid ${publicVariables.color.smooth}`,
  },
});

export const button = styleVariants({
  primary: [
    base,
    {
      backgroundColor: publicVariables.color.brand,
      color: publicVariables.color.white,
      border: "none",
      ":hover": {
        backgroundColor: publicVariables.color.accent,
      },
    },
  ],
  secondary: [
    base,
    {
      "@media": {
        "(prefers-color-scheme: light)": {
          backgroundColor: publicVariables.color.white,
          color: publicVariables.color.blue900,
          ":hover": {
            backgroundColor: "rgba(20, 32, 73, 0.04);",
          },
        },
        "(prefers-color-scheme: dark)": {
          backgroundColor: publicVariables.color.grey700,
          color: publicVariables.color.grey100,
          ":hover": {
            backgroundColor: "rgba(243, 243, 245, 0.1)",
          },
        },
      },
      border: "1px solid rgba(20, 32, 73, 0.12)",
    },
  ],
});

export const icon = style({
  marginRight: "22px",
  display: "flex",
  alignItems: "center",
});
