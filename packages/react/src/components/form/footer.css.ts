import { style } from "@vanilla-extract/css";
import {
  theme,
  publicVariables,
} from "@slashid/react-primitives/src/theme/theme.css";

export const footer = style({
  width: "100%",
  marginTop: theme.space[8],
  textAlign: "center",
  color: publicVariables.color.placeholder,
});
