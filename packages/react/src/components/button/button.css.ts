import { style, styleVariants } from "@vanilla-extract/css";
import { colors, publicVariables, theme } from "../../theme/theme.css";

const base = style({
  fontFamily: publicVariables.font.fontFamily,
  borderRadius: publicVariables.border.radius,
  fontWeight: theme.font.weight.medium,
  fontSize: theme.font.size.base,
  height: theme.input.height,
  width: "100%",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const md = style({
  width: "auto",
  height: "auto",
  padding: "14px 16px",
  borderRadius: "16px",
});

export const button = styleVariants({
  primary: [
    base,
    {
      backgroundColor: publicVariables.color.primary,
      color: colors.white,
      border: "none",

      ":hover:not([disabled])": {
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

      ":hover:not([disabled])": {
        backgroundColor: publicVariables.color.soft,
      },
    },
  ],
  secondaryMd: [
    base,
    md,
    {
      backgroundColor: publicVariables.color.panel,
      color: publicVariables.color.foreground,
      border: `1px solid ${publicVariables.color.smooth}`,

      ":hover:not([disabled])": {
        backgroundColor: publicVariables.color.soft,
      },
    },
  ],
  neutral: [
    base,
    {
      border: "none",
      backgroundColor: publicVariables.color.foreground,
      color: publicVariables.color.background,

      ":hover:not([disabled])": {
        backgroundColor: publicVariables.color.contrast,
      },
    },
  ],
  neutralMd: [
    base,
    md,
    {
      border: "none",
      backgroundColor: publicVariables.color.foreground,
      color: publicVariables.color.background,

      ":hover:not([disabled])": {
        backgroundColor: publicVariables.color.contrast,
      },
    },
  ],
  ghostMd: [
    base,
    md,
    {
      border: "none",
      backgroundColor: publicVariables.color.panel,
      color: publicVariables.color.foreground,

      ":hover:not([disabled])": {
        backgroundColor: publicVariables.color.soft,
      },
    },
  ],
});

export const buttonDisabled = style({
  opacity: "0.6",

  ":hover": {
    cursor: "not-allowed",
  },
});

export const icon = style({
  marginRight: "22px",
  display: "flex",
  alignItems: "center",
});
