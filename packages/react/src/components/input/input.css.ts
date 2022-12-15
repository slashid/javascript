import { style, styleVariants } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const input = style({
  all: "unset",
  width: "100%",
  fontSize: theme.font.size.base,
  fontWeight: theme.font.weight.semibold,
  color: publicVariables.color.foreground,

  "::placeholder": {
    color: publicVariables.color.placeholder,
  },
});

export const select = style({
  opacity: 0,
  width: "100%",
  height: "100%",

  ":hover": {
    cursor: "pointer",
  },
});

export const countryHost = style({
  position: "relative",
  height: "100%",
  width: "212px",
  borderRight: `1px solid ${publicVariables.color.subtle}`,

  selectors: {
    [`&:has(${select}:active)`]: {
      borderRight: `1px solid ${publicVariables.color.tertiary}`,
    },
    [`&:has(${select}:focus)`]: {
      borderRight: `1px solid ${publicVariables.color.tertiary}`,
    },
    [`&:has(${select}:hover)`]: {
      borderRight: `1px solid ${publicVariables.color.placeholder}`,
    },
  },
});

export const host = style({
  display: "flex",
  alignItems: "flex-start",
  border: `1px solid ${publicVariables.color.subtle}`,
  width: "100%",
  minWidth: theme.input.minWidth,
  boxSizing: "border-box",
  fontFamily: publicVariables.font.fontFamily,
  borderRadius: publicVariables.border.radius,
  height: theme.input.height,

  selectors: {
    [`&:has(${input}:active)`]: {
      border: `1px solid ${publicVariables.color.tertiary}`,
    },
    [`&:has(${input}:focus)`]: {
      border: `1px solid ${publicVariables.color.tertiary}`,
    },
    [`&:has(${input}:hover)`]: {
      border: `1px solid ${publicVariables.color.placeholder}`,
    },
    [`&:has(${select}:active)`]: {
      border: `1px solid ${publicVariables.color.tertiary}`,
    },
    [`&:has(${select}:focus)`]: {
      border: `1px solid ${publicVariables.color.tertiary}`,
    },
    [`&:has(${select}:hover)`]: {
      border: `1px solid ${publicVariables.color.placeholder}`,
    },
  },
});

const inputHostBase = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  padding: `0 ${theme.input.paddingHorizontal}`,
  borderLeft: "1px solid transparent",
});

export const inputHost = styleVariants({
  text: [inputHostBase, {}],
  email: [inputHostBase, {}],
  tel: [
    inputHostBase,
    {
      selectors: {
        [`&:has(${input}:active)`]: {
          borderLeft: `1px solid ${publicVariables.color.tertiary}`,
        },
        [`&:has(${input}:focus)`]: {
          borderLeft: `1px solid ${publicVariables.color.tertiary}`,
        },
        [`&:has(${input}:hover)`]: {
          borderLeft: `1px solid ${publicVariables.color.placeholder}`,
        },
      },
    },
  ],
});

export const label = style({
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.semibold,
  color: publicVariables.color.contrast,
});

export const countryCode = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "94px",
  position: "absolute",
  top: "50%",
  left: theme.input.paddingHorizontal,
  transform: "translateY(-50%)",
  fontSize: theme.font.size.base,
  color: publicVariables.color.contrast,
});
