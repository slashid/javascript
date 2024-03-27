import { style, keyframes } from "@vanilla-extract/css";

export const container = style({
  padding: "16px",
  display: "flex",
  width: "fitContent",
  height: "fitContent",
  borderRadius: "50%",
});

const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const content = style({
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  border: "3px solid white",
  borderBottomColor: "transparent",
  boxSizing: "border-box",
  display: "inline-block",
  animation: `${rotate} 1s linear infinite`,
});
