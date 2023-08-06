import { keyframes, style } from "@vanilla-extract/css";

const slideDown = keyframes({
  "0%": { height: "0" },
  "100%": { height: "var(--radix-accordion-content-height)" },
});

const slideUp = keyframes({
  "0%": { height: "var(--radix-accordion-content-height)" },
  "100%": { height: "0" },
});

const animationProps = "150ms cubic-bezier(0.16, 1, 0.3, 1)";

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "0",
});

export const trigger = style({
  all: "unset",
  flex: "1",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  cursor: "pointer",
});

export const chevron = style({
  width: "20px",
  height: "20px",
  transform: "rotate(180deg)",
  selectors: {
    [`${trigger}[data-state='open'] > &`]: {
      transform: "rotate(90deg)",
    },
  },
});

export const content = style({
  overflow: "hidden",
  selectors: {
    '&[data-state="open"]': {
      animation: `${slideDown} ${animationProps}`,
    },
    '&[data-state="closed"]': {
      animation: `${slideUp} ${animationProps}`,
    },
  },
});
