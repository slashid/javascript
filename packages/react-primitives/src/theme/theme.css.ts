import {
  createTheme,
  createGlobalThemeContract,
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
  red500: "#FF0042",
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
      error: "color-error",
      auxiliary: "color-auxiliary",
      // KYC
      success: "color-success",
      foregroundSuccess: "color-foreground-success",
      backgroundSuccess: "color-background-success",
      failure: "color-failure",
      foregroundFailure: "color-foreground-failure",
      backgroundFailure: "color-background-failure",
    },
    font: {
      fontFamily: "font-family",
    },
    border: {
      radius: "button-border-radius",
      width: {
        panel: "border-width-panel",
      },
    },
  },
  // TODO consider using the second argument to generate the names based on the object path
  // https://github.com/buildo/bento-design-system/blob/a0bfb585a3216988f1945d5c8c448c32426e61f2/packages/bento-design-system/src/vars.css.ts#L232
  (value) => `sid-${value}`
);

const lightThemeColors = {
  background: colors.grey100,
  mute: colors.grey100,
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
  error: colors.red500,
  auxiliary: "#FAFAFA",
  // KYC
  success: "#059E56",
  foregroundSuccess: "#016A1C",
  backgroundSuccess: "#E6F3ED",
  failure: "#F40B49",
  foregroundFailure: "#B1000F",
  backgroundFailure: "#FFF0F4",
};

export const darkThemeColors = {
  background: colors.grey900,
  mute: colors.grey800,
  panel: colors.grey700,
  foreground: colors.grey100,
  contrast: "rgba(243, 243, 245, 0.8)",
  secondary: "rgba(243, 243, 245, 0.6)",
  tertiary: "rgba(243, 243, 245, 0.5)",
  placeholder: "rgba(243, 243, 245, 0.3)",
  smooth: "rgba(243, 243, 245, 0.12)",
  subtle: "rgba(243, 243, 245, 0.06)",
  soft: "rgba(243, 243, 245, 0.04)",
  offset: "rgba(243, 243, 245, 0.01)",
  primary: colors.blue500,
  primaryHover: colors.blue600,
  transparent: "transparent",
  error: colors.red500,
  auxiliary: colors.grey800,
  // KYC
  success: "#059E56",
  foregroundSuccess: "#016A1C",
  backgroundSuccess: "#E6F3ED",
  failure: "#F40B49",
  foregroundFailure: "#B1000F",
  backgroundFailure: "#FFF0F4",
};

export const lightTheme = {
  color: lightThemeColors,
  font: {
    fontFamily: "'Twemoji Country Flags', sans-serif",
  },
  border: {
    radius: "16px",
    width: {
      panel: "2px",
    },
  },
};

export const darkTheme = style({
  vars: assignVars(publicVariables.color, darkThemeColors),
});

export const lightThemeVars = style({
  vars: assignVars(publicVariables.color, lightThemeColors),
});

// overrides the color theme based on system settings
export const autoTheme = style({
  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: assignVars(publicVariables.color, darkThemeColors),
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
      "1xl": "20px",
      "2xl-title": "24px",
    },
  },
  space: {
    "0": "0",
    px: "1px",
    "0.5": "0.125rem",
    "1": "0.25rem",
    "1.5": "0.375rem",
    "2": "0.5rem",
    "2.5": "0.625rem",
    "3": "0.75rem",
    "3.5": "0.875rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
    "11": "2.75rem",
    "12": "3rem",
    "13": "3.25rem",
    "14": "3.5rem",
    "15": "3.75rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
    "28": "7rem",
    "32": "8rem",
    "36": "9rem",
    "40": "10rem",
    "44": "11rem",
    "48": "12rem",
    "52": "13rem",
    "56": "14rem",
    "60": "15rem",
    "64": "16rem",
    "68": "17rem",
    "72": "18rem",
    "76": "19rem",
    "80": "20rem",
    "96": "24rem",
  },
  input: {
    height: "60px",
    paddingHorizontal: "16px",
    paddingVertical: "12px",
    minWidth: "240px",
  },
  color: {
    md: "4px 0px 24px rgba(29, 25, 77, 0.03), 0px 12px 32px rgba(29, 25, 77, 0.04)",
  },
  boxShadow: {
    lg: "32px 80px 116px 0px rgba(15, 14, 27, 0.10), 120px 0px 184px 0px rgba(15, 14, 27, 0.10)",
    dim: "0px 0px 4px 0px rgba(33, 36, 51, 0.02), 0px 6px 12px 0px rgba(33, 36, 51, 0.03)",
  },
});

export type Theme = "light" | "dark" | "auto";
