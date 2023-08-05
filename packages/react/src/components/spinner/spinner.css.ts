import { keyframes, style, styleVariants } from "@vanilla-extract/css";

const rotation = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

export const spinner = style({
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

export const background = style({
  padding: "16px",
  display: "flex",
  width: "fit-content",
  height: "fit-content",
  borderRadius: "50%",
  background:
    "linear-gradient(148.27deg, rgba(42, 106, 255, 0.86) 14.4%, rgba(42, 106, 255, 0.74) 87.37%)",
});
