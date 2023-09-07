import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const container = style({
  display: "flex",
  gap: "4px",
  justifyContent: "space-around",
});

export const otpInput = style({
  all: "unset",
  width: "64px",
  height: "64px",
  padding: "20px 16px",
  borderRadius: "16px",
  boxSizing: "border-box",
  border: `1px solid ${publicVariables.color.subtle}`,
  backgroundColor: publicVariables.color.offset,
  fontSize: theme.font.size.base,
  fontWeight: theme.font.weight.semibold,
  fontFamily: publicVariables.font.fontFamily,
  color: publicVariables.color.foreground,
  textAlign: "center",

  "::placeholder": {
    color: publicVariables.color.placeholder,
  },

  ":active": {
    border: `1px solid ${publicVariables.color.tertiary}`,
  },
  ":focus": {
    border: `1px solid ${publicVariables.color.tertiary}`,
  },
  ":hover": {
    border: `1px solid ${publicVariables.color.placeholder}`,
  },

  selectors: {
    /* Hide Arrows From Input Number for Chrome, Safari, Edge, Opera */
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },

    /* Hide Arrows From Input Number for Firefox */
    "&[type=number]": {
      MozAppearance: "textfield",
    },
  },
});
