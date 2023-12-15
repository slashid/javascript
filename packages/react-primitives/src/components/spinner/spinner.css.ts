import { keyframes, style, styleVariants } from "@vanilla-extract/css";

const rotation = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

const spinner = style({
  borderRadius: "50%",
  border: "3px solid white",
  borderBottomColor: "transparent",
  boxSizing: "border-box",
  display: "inline-block",
  animation: `${rotation} 1s linear infinite`,
});

export const spinnerVariants = styleVariants({
  default: [
    spinner,
    {
      width: "24px",
      height: "24px",
    },
  ],
  short: [
    spinner,
    {
      width: "16px",
      height: "16px",
    },
  ],
});
