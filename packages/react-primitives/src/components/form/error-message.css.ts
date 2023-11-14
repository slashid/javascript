import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const errorMessage = style({
  display: "block",
  marginTop: theme.space[2],
  color: publicVariables.color.error,
  fontWeight: "600",
  lineHeight: "122%",
});
