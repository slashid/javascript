import { style } from "@vanilla-extract/css";
import { publicVariables } from "@slashid/react-primitives";

export const organizationSwitcher = style({
  fontFamily: publicVariables.font.fontFamily,
  color: publicVariables.color.foreground,
  backgroundColor: publicVariables.color.panel,
  borderRadius: publicVariables.border.radius,
});
