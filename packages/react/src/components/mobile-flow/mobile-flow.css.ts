import { style } from "@vanilla-extract/css";
import { publicVariables } from "@slashid/react-primitives/src/theme/theme.css";

export const mobileFlow = style({
  fontFamily: publicVariables.font.fontFamily,
  color: publicVariables.color.foreground,
  padding: 20,
  lineHeight: "normal",
  backgroundColor: publicVariables.color.panel,
  height: "100%",
});
