import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const list = style({
  display: "flex",
  backgroundColor: publicVariables.color.mute,
  borderRadius: publicVariables.border.radius,
  padding: "3px",
  fontFamily: publicVariables.font.fontFamily,
  fontSize: theme.font.size.base,
});

export const trigger = style({
  all: "unset",
  padding: "12px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1",
  textAlign: "center",
  lineHeight: "118%",

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
