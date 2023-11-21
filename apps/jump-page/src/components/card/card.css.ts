import { publicVariables } from "@slashid/react-primitives";
import { style } from "@vanilla-extract/css";

export const card = style({
  backgroundColor: publicVariables.color.panel,
  width: "465px",
  padding: "32px 32px 16px 32px",
  boxSizing: "border-box",

  "@media": {
    "screen and (min-width: 768px)": {
      borderRadius: `calc(2 * ${publicVariables.border.radius})`,
    },
  },
});
