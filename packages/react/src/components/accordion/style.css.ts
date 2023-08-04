import { keyframes, style } from "@vanilla-extract/css";
import { publicVariables } from "../../theme/theme.css";

const slideDown = keyframes({
  "0%": { height: "0" },
  "100%": { height: "var(--radix-accordion-content-height)" },
});

const slideUp = keyframes({
  "0%": { height: "var(--radix-accordion-content-height)" },
  "100%": { height: "0" },
});

const animationProps = "150ms cubic-bezier(0.16, 1, 0.3, 1)";

export const accordion = style({
  background: publicVariables.color.panel,
});

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0",
  // TODO: move border to parent
  borderBottom: `1px solid ${publicVariables.color.subtle}`,
});

export const trigger = style({
  all: "unset",
  flex: "1",
  display: "flex",
  alignItems: "center",
  padding: "10px 0",
  cursor: "pointer",
});

export const chevron = style({
  height: "100%",
  transform: "rotate(180deg)",
  selectors: {
    [`${trigger}[data-state='open'] > &`]: {
      transform: "rotate(90deg)",
    },
  },
});

export const content = style({
  selectors: {
    '&[data-state="open"]': {
      animation: `${slideDown} ${animationProps}`,
    },
    '&[data-state="closed"]': {
      animation: `${slideUp} ${animationProps}`,
    },
  },
});
