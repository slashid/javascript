import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const button = style({
  backgroundColor: publicVariables.color.brand,
  fontFamily: publicVariables.font.fontFamily,
  borderRadius: publicVariables.button.borderRadius,
  fontWeight: theme.font.weight.medium,
  fontSize: theme.font.size.base,
  color: publicVariables.color.white,

  padding: "19px 22px",
  userSelect: "none",
  lineHeight: "118%",
  border: "none",
  height: theme.input.height,

  ":hover": {
    cursor: "pointer",
    backgroundColor: publicVariables.color.accent,
  },

  ":active": {
    transform: "scale(.98)",
  },
});
