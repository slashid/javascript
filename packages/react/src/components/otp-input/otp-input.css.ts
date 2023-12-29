import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "@slashid/react-primitives";

export const container = style({
  display: "flex",
  gap: "4px",
  justifyContent: "center",
});

export const otpInput = style({
  all: "unset",
  maxWidth: "64px",
  width: "100%",
  height: "auto",
  aspectRatio: "1/1",
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
});
