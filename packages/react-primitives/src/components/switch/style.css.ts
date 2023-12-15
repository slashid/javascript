import { style } from "@vanilla-extract/css";
import { colors, publicVariables, theme } from "../../theme/theme.css";

export const radixSwitch = style({
  all: "unset",
  position: "relative",
  display: "block",
  width: "34px",
  height: "24px",
  borderRadius: "100px",

  selectors: {
    '&[disabled]:not([data-blocked="true"])': {
      opacity: 0.4,
      cursor: "not-allowed",
    },
    '&[data-state="unchecked"]': {
      backgroundColor: publicVariables.color.placeholder,
    },
    '&[data-state="unchecked"]:hover': {
      backgroundColor: publicVariables.color.tertiary,
    },
    '&[data-state="checked"]': {
      backgroundColor: publicVariables.color.primary,
    },
    '&[data-state="checked"]:hover': {
      backgroundColor: publicVariables.color.primaryHover,
    },
    '&[data-blocked="true"]': {
      backgroundColor: publicVariables.color.subtle,
    },
    '&[data-blocked="true"]:hover': {
      backgroundColor: publicVariables.color.subtle,
    },
  },
});

export const switchThumb = style({
  display: "block",
  width: "20px",
  height: "20px",
  margin: "2px",
  backgroundColor: colors.white,
  borderRadius: "100px",
  transition: "transform 100ms",
  willChange: "transform",

  selectors: {
    '&[data-state="checked"]': {
      transform: "translateX(10px)",
      boxShadow: theme.boxShadow.dim,
    },
  },
});

export const switchLock = style({
  display: "block",
  margin: "auto",
});
