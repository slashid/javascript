import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const form = style({
  fontFamily: publicVariables.font.fontFamily,
  color: publicVariables.color.foreground,
  backgroundColor: publicVariables.color.panel,
  width: "100%",
  padding: "32px",
  boxSizing: "border-box",

  "@media": {
    "screen and (min-width: 768px)": {
      borderRadius: `calc(2 * ${publicVariables.border.radius})`,
    },
  },
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[1],
});
