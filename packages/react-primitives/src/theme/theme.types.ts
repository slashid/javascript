import { publicVariables } from "./theme.css";

export type ThemeContract = typeof publicVariables;

// TODO at some point figure out how to get this from Vanilla extract, it will go out of sync
export const themeVarNames = [
  "--sid-color-background",
  "--sid-color-mute",
  "--sid-color-panel",
  "--sid-color-foreground",
  "--sid-color-contrast",
  "--sid-color-secondary",
  "--sid-color-tertiary",
  "--sid-color-placeholder",
  "--sid-color-smooth",
  "--sid-color-subtle",
  "--sid-color-soft",
  "--sid-color-offset",
  "--sid-color-primary",
  "--sid-color-primary-hover",
  "--sid-color-transparent",
  "--sid-color-error",
  "--sid-color-auxiliary",
  "--sid-color-success",
  "--sid-color-foreground-success",
  "--sid-color-background-success",
  "--sid-color-failure",
  "--sid-color-foreground-failure",
  "--sid-color-background-failure",
  "--sid-font-family",
  "--sid-border-width-panel",
  "--sid-input-border-radius",
  "--sid-input-border-color",
  "--sid-input-label-color",
  "--sid-button-border-radius",
  "--sid-form-border-radius",
  "--sid-form-logo-width",
] as const;

export type ThemePublicVars = (typeof themeVarNames)[number];
