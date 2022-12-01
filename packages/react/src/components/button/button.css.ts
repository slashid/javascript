import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const button = style({
  backgroundColor: publicVariables.color.brand,
  fontFamily: publicVariables.font.fontFamily,
  borderRadius: publicVariables.button.borderRadius,
  fontWeight: theme.font.weight.medium,
  fontSize: theme.font.size.base,
  color: publicVariables.color.textWhite,
  padding: "19px 22px",
  lineHeight: "118%",
  border: "none",
});
