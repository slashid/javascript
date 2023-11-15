import { style } from "@vanilla-extract/css";
import {
  theme,
  publicVariables,
} from "@slashid/react-primitives/src/theme/theme.css";

export const divider = style({
  display: "flex",
  alignItems: "center",
  margin: `${theme.space[6]} 0`,
  gap: theme.space[2],
});

export const content = style({
  color: publicVariables.color.placeholder,
});

export const hr = style({
  all: "unset",
  width: "100%",
  borderTop: `1px solid ${publicVariables.color.smooth}`,
});
