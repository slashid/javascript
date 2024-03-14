import { style } from "@vanilla-extract/css";
import { theme } from "@slashid/react-primitives";

export const oidcProvider = style({
  marginLeft: theme.space[1],
});

export const oidcList = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
});
