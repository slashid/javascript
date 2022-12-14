import { style } from "@vanilla-extract/css";
import { publicVariables } from "../../theme/theme.css";

export const form = style({
  fontFamily: publicVariables.font.fontFamily,
  color: publicVariables.color.foreground,
  backgroundColor: publicVariables.color.panel,
  width: "100%",
  padding: "20px",

  "@media": {
    "screen and (min-width: 768px)": {
      borderRadius: `calc(2 * ${publicVariables.border.radius})`,
    },
  },
});
