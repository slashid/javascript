import { style } from "@vanilla-extract/css";
import { theme } from "../../../theme/theme.css";

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
  marginBottom: theme.space[4],
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
