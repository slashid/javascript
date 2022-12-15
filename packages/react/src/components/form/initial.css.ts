import { style } from "@vanilla-extract/css";
import { publicVariables } from "../../theme/theme.css";

export const oidcProvider = style({
  textTransform: "capitalize",
  marginLeft: "0.25rem",
});

export const subtitle = style({
  color: publicVariables.color.contrast,
});
