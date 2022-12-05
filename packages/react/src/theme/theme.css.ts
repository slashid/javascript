import {
  createTheme,
  createGlobalThemeContract,
  createGlobalTheme,
} from "@vanilla-extract/css";

export const publicVariables = createGlobalThemeContract(
  {
    color: {
      brand: "color-brand",
      textWhite: "color-text-white",
      accent: "color-accent",
      blue500: "color-blue-500",
      blue600: "color-blue-600",
    },
    font: {
      fontFamily: "font-family",
    },
    button: {
      borderRadius: "button-border-radius",
    },
  },
  (value) => `sid-${value}`
);

createGlobalTheme(".sid-theme-root", publicVariables, {
  color: {
    brand: publicVariables.color.blue500,
    textWhite: "#FFFFFF",
    accent: publicVariables.color.blue600,
    blue500: "#2A6AFF",
    blue600: "#2761E8",
  },
  font: {
    fontFamily: "Inter",
  },
  button: {
    borderRadius: "16px",
  },
});

export const [themeClass, theme] = createTheme({
  font: {
    weight: {
      medium: "500",
      semibold: "600",
    },
    size: {
      base: "16px",
    },
  },
  input: {
    height: "58px",
  },
});
