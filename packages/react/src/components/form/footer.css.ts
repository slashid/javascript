import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const footer = style({
  width: "100%",
  marginTop: theme.space[8],
  textAlign: "center",
  color: publicVariables.color.placeholder,
});
