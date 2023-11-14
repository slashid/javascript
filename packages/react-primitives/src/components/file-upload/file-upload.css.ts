import { style, styleVariants } from "@vanilla-extract/css";
import { colors, publicVariables, theme } from "../../theme/theme.css";

export const imagePreview = style({
  width: "100%",
  height: "100%",
  objectFit: "contain",
});

export const loading = style({
  justifyContent: "center",
  alignItems: "center",
});

export const inputFile = style({
  color: "transparent",
  width: "100%",
  selectors: {
    "&::file-selector-button": {
      display: "none",
    },
  },
  ":before": {
    display: "inline-block",
    content: "Upload",
    color: colors.white,
    background: publicVariables.color.primary,
    borderRadius: publicVariables.border.radius,
    padding: `${theme.input.paddingHorizontal} 0px`,
    width: "100%",
    textAlign: "center",
  },
});

const base = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  textAlign: "center",
  height: 240,
  borderWidth: publicVariables.border.width.panel,
  borderRadius: publicVariables.border.radius,
  padding: 26,
});

export const dsu = styleVariants({
  empty: [
    base,
    {
      borderStyle: "solid",
      borderColor: publicVariables.color.smooth,
    },
  ],
  success: [
    base,
    {
      borderStyle: "solid",
      borderColor: publicVariables.color.success,
    },
  ],
  failure: [
    base,
    {
      borderStyle: "solid",
      borderColor: publicVariables.color.failure,
    },
  ],
});

export type DSUVariants = keyof typeof dsu;
