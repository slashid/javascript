import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const stack = recipe({
  base: {
    display: "flex",
  },

  variants: {
    direction: {
      vertical: { flexDirection: "column" },
      horizontal: { flexDirection: "row" },
    },
    space: {
      between: {
        justifyContent: "space-between",
        flexGrow: 1,
      },
      evenly: {
        justifyContent: "space-evenly",
        flexGrow: 1,
      },
    },
  },

  defaultVariants: {
    direction: "vertical",
  },
});

export type StackVariants = RecipeVariants<typeof stack>;
