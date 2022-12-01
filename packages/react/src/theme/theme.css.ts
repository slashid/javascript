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
    brand: "#2A6AFF",
    textWhite: "#FFFFFF",
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
});
