import { theme } from "@slashid/react-primitives";
import { style } from "@vanilla-extract/css";

export const stack = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[4],
});
