import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const button = style({
  fontFamily: publicVariables.font.fontFamily,
  fontWeight: theme.font.weight.semibold,
  fontSize: theme.font.size.sm,

  backgroundColor: "transparent",
  userSelect: "none",
  lineHeight: "118%",
  border: "none",
  color: publicVariables.color.foreground,

  ":hover": {
    cursor: "pointer",
    opacity: 0.6,
  },

  ":active": {
    transform: "scale(.98)",
  },
});
