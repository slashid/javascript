import { style } from "@vanilla-extract/css";
import { publicVariables } from "@slashid/react-primitives";

export const form = style({
  fontFamily: publicVariables.font.fontFamily,
  color: publicVariables.color.foreground,
  backgroundColor: publicVariables.color.panel,
  width: "100%",
  padding: "32px 32px 16px 32px",
  boxSizing: "border-box",

  "@media": {
    "screen and (min-width: 768px)": {
      borderRadius: `calc(2 * ${publicVariables.form.border.radius})`,
    },
  },
});
