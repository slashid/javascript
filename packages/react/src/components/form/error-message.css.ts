import { style } from "@vanilla-extract/css";
import {
  theme,
  publicVariables,
} from "@slashid/react-primitives";

export const errorMessage = style({
  display: "block",
  marginTop: theme.space[2],
  color: publicVariables.color.error,
  fontWeight: "600",
  lineHeight: "122%",
});
