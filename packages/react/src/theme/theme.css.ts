import {
  createTheme,
  createGlobalThemeContract,
  createGlobalTheme,
} from "@vanilla-extract/css";

export const publicVariables = createGlobalThemeContract(
  {
    color: {
      brand: "color-brand",
      accent: "color-accent",
      white: "color-white",
      black: "color-black",
      transparent: "color-transparent",
      grey100: "color-grey-100",
      blue500: "color-blue-500",
      blue600: "color-blue-600",
      blue900: "color-blue-900",
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
    transparent: "color-transparent",
    brand: publicVariables.color.blue500,
    accent: publicVariables.color.blue600,
    white: "#FFFFFF",
    black: "#000000",
    grey100: "#F3F3F5",
    blue500: "#2A6AFF",
    blue600: "#2761E8",
    blue900: "#142049",
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
      sm: "14px",
      base: "16px",
    },
  },
  input: {
    height: "58px",
  },
});
