import { colors, publicVariables, theme } from "../../theme/theme.css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const text = recipe({
  base: {
    fontFamily: publicVariables.font.fontFamily,
    fontWeight: theme.font.weight.medium,
    fontSize: theme.font.size.base,
    color: publicVariables.color.foreground,
    margin: 0,
    lineHeight: "100%",
  },

  variants: {
    size: {
      xs: { fontSize: "12px" },
      sm: { fontSize: "14px", lineHeight: "112%" },
      base: { fontSize: "16px", lineHeight: "122%" },
      xl: { fontSize: "20px" },
      "2xl-title": { fontSize: "24px", lineHeight: "118%" },
    },
    weight: {
      medium: { fontWeight: "500" },
      semibold: { fontWeight: "600" },
      bold: { fontWeight: "700" },
    },
    color: {
      contrast: { color: publicVariables.color.contrast },
      tertiary: { color: publicVariables.color.tertiary },
      // KYC
      white: { color: colors.white },
      success: { color: publicVariables.color.foregroundSuccess },
      failure: { color: publicVariables.color.foregroundFailure },
    },
  },

  defaultVariants: {
    size: "base",
    weight: "medium",
  },
});

export type TextVariants = RecipeVariants<typeof text>;
