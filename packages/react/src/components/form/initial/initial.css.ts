import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "@slashid/react-primitives";

export const oidcProvider = style({
  marginLeft: theme.space[1],
});

export const ssoProvider = style({
  marginLeft: theme.space[1],
});

export const oidcList = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
});

export const logo = style({
  display: "flex",
  maxHeight: "32px",
  marginBottom: theme.space[4],
  width: publicVariables.form.logo.width,
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[1],
});

export const dropdownContent = style({
  width: "var(--radix-select-trigger-width)",
  marginTop: "4px",
});

export const ssoLogo = style({
  height: "16px",
});
