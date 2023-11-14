import { colors, publicVariables } from "../../theme/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

const base = style({
  alignItems: "start",
  padding: 16,
  borderRadius: publicVariables.border.radius,
});

export const banner = styleVariants({
  success: [
    base,
    {
      backgroundColor: publicVariables.color.backgroundSuccess,
    },
  ],
  failure: [
    base,
    {
      backgroundColor: publicVariables.color.backgroundFailure,
    },
  ],
});

export const description = style({
  color: colors.blue900,
});
