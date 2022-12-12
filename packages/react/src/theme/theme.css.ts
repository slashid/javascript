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
      contrast: "color-contrast",
      foreground: "color-foreground",
      placeholder: "color-placeholder",
      smooth: "color-smooth",
      soft: "color-soft",
      tertiary: "color-tertiary",
      subtle: "color-subtle",
      white: "color-white",
      black: "color-black",
      transparent: "color-transparent",
      grey100: "color-grey-100",
      grey700: "color-grey-700",
      blue500: "color-blue-500",
      blue600: "color-blue-600",
      blue900: "color-blue-900",
    },
    font: {
      fontFamily: "font-family",
    },
    border: {
      radius: "button-border-radius",
    },
  },
  (value) => `sid-${value}`
);

createGlobalTheme(".sid-theme-root", publicVariables, {
  color: {
    transparent: "color-transparent",
    brand: publicVariables.color.blue500,
    accent: publicVariables.color.blue600,
    contrast: "rgba(20, 32, 73, 0.8)",
    foreground: publicVariables.color.blue900,
    smooth: "rgba(20, 32, 73, 0.12)",
    placeholder: "rgba(20, 32, 73, 0.3)",
    tertiary: "rgba(20, 32, 73, 0.5)",
    subtle: "rgba(20, 32, 73, 0.06)",
    soft: "rgba(20, 32, 73, 0.04)",
    white: "#FFFFFF",
    black: "#000000",
    grey100: "#F3F3F5",
    grey700: "#222131",
    blue500: "#2A6AFF",
    blue600: "#2761E8",
    blue900: "#142049",
  },
  font: {
    fontFamily: "Inter",
  },
  border: {
    radius: "16px",
  },
});

export const [themeClass, theme] = createTheme({
  font: {
    weight: {
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    size: {
      xs: "12px",
      sm: "14px",
      base: "16px",
    },
  },
  input: {
    height: "58px",
    paddingHorizontal: "16px",
    minWidth: "240px",
  },
  color: {
    panel: "#FFFFFF",
    md: "4px 0px 24px rgba(29, 25, 77, 0.03), 0px 12px 32px rgba(29, 25, 77, 0.04)",
  },
});
