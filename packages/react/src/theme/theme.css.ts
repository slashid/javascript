import {
  createTheme,
  createGlobalThemeContract,
  createGlobalTheme,
  style,
  assignVars,
} from "@vanilla-extract/css";

// private color palette
export const colors = {
  white: "#FFFFFF",
  black: "#000000",
  grey50: "#F7F7F8",
  grey100: "#F3F3F5",
  grey700: "#222131",
  grey800: "#171625",
  grey900: "#0F0E1B",
  blue500: "#2A6AFF",
  blue600: "#2761E8",
  blue900: "#142049",
};

// public CSS variables that can be customised
export const publicVariables = createGlobalThemeContract(
  {
    color: {
      background: "color-background",
      mute: "color-mute",
      panel: "color-panel",
      foreground: "color-foreground",
      contrast: "color-contrast",
      secondary: "color-secondary",
      tertiary: "color-tertiary",
      placeholder: "color-placeholder",
      smooth: "color-smooth",
      subtle: "color-subtle",
      soft: "color-soft",
      offset: "color-offset",
      primary: "color-primary",
      primaryHover: "color-primary-hover",
      transparent: "color-transparent",
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

// default: light theme
createGlobalTheme(".sid-theme-root", publicVariables, {
  color: {
    background: colors.grey100,
    mute: colors.grey50,
    panel: colors.white,
    foreground: colors.blue900,
    contrast: "rgba(20, 32, 73, 0.8)",
    secondary: "rgba(20, 32, 73, 0.6)",
    tertiary: "rgba(20, 32, 73, 0.5)",
    placeholder: "rgba(20, 32, 73, 0.3)",
    smooth: "rgba(20, 32, 73, 0.12)",
    subtle: "rgba(20, 32, 73, 0.06)",
    soft: "rgba(20, 32, 73, 0.04)",
    offset: "rgba(20, 32, 73, 0.01)",
    primary: colors.blue500,
    primaryHover: colors.blue600,
    transparent: "transparent",
  },
  font: {
    fontFamily: "Inter",
  },
  border: {
    radius: "16px",
  },
});

// overrides the color theme if dark mode is preferred
export const darkTheme = style({
  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: assignVars(publicVariables.color, {
        background: colors.grey900,
        mute: colors.grey800,
        panel: colors.grey700,
        foreground: colors.grey100,
        contrast: "rgba(243, 243, 245, 0.8)",
        secondary: "rgba(243, 243, 245, 0.6",
        tertiary: "rgba(243, 243, 245, 0.5)",
        placeholder: "rgba(243, 243, 245, 0.3)",
        smooth: "rgba(243, 243, 245, 0.12)",
        subtle: "rgba(243, 243, 245, 0.06)",
        soft: "rgba(243, 243, 245, 0.04)",
        offset: "rgba(243, 243, 245, 0.01)",
        primary: colors.blue500,
        primaryHover: colors.blue600,
        transparent: "transparent",
      }),
    },
  },
});

// constants to be reused across the app
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
      "2xl-title": "24px",
    },
  },
  input: {
    height: "58px",
    paddingHorizontal: "16px",
    minWidth: "240px",
  },
  color: {
    md: "4px 0px 24px rgba(29, 25, 77, 0.03), 0px 12px 32px rgba(29, 25, 77, 0.04)",
  },
});
