import { publicVariables } from "@slashid/react-primitives";
import { style } from "@vanilla-extract/css";

export const app = style({
  fontFamily: publicVariables.font.fontFamily,
  backgroundColor: publicVariables.color.background,
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100vh",
  padding: 0,
  margin: 0,
});
