import { colors, publicVariables, theme } from "../../theme/theme.css";
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
      backgroundColor: publicVariables.color.primary,
      color: colors.white,
      border: "none",
      ":hover": {
        backgroundColor: publicVariables.color.primaryHover,
      },
    },
  ],
  secondary: [
    base,
    {
      backgroundColor: publicVariables.color.panel,
      color: publicVariables.color.foreground,
      border: `1px solid ${publicVariables.color.smooth}`,

      ":hover": {
        backgroundColor: publicVariables.color.soft,
      },
    },
  ],
});

export const icon = style({
  marginRight: "22px",
  display: "flex",
  alignItems: "center",
});
