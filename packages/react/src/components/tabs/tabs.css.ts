import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const list = style({
  display: "flex",
  backgroundColor: publicVariables.color.mute,
  borderRadius: publicVariables.border.radius,
  width: "100%",
  padding: "4px",
  fontFamily: publicVariables.font.fontFamily,
  fontSize: theme.font.size.base,
});

export const trigger = style({
  all: "unset",
  padding: "12px 24px",
  display: "flex",
  alignItems: "center",
  flex: "1",

  selectors: {
    '&[data-state="active"]': {
      borderRadius: `calc(${publicVariables.border.radius} * 0.875)`,
      backgroundColor: publicVariables.color.panel,
      color: publicVariables.color.foreground,
    },
    '&[data-state="inactive"]': {
      cursor: "pointer",
      color: publicVariables.color.contrast,
    },
  },
});
