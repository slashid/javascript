import { publicVariables, theme } from "../../theme/theme.css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const text = recipe({
  base: {
    fontFamily: publicVariables.font.fontFamily,
    fontWeight: theme.font.weight.medium,
    fontSize: theme.font.size.base,
    margin: 0,
  },

  variants: {
    size: {
      xs: { fontSize: "12px" },
      sm: { fontSize: "14px" },
      base: { fontSize: "16px" },
      xl: { fontSize: "20px" },
      "2xl-title": { fontSize: "24px" },
    },
    weight: {
      medium: { fontWeight: "500" },
      semibold: { fontWeight: "600" },
      bold: { fontWeight: "700" },
    },
  },

  defaultVariants: {
    size: "base",
    weight: "medium",
  },
});

export type TextVariants = RecipeVariants<typeof text>;
