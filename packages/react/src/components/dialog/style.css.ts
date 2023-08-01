import { keyframes, style } from "@vanilla-extract/css";
import { publicVariables } from "../../theme/theme.css";

const show = keyframes({
  "0%": { opacity: "0" },
  "100%": { opacity: "1" },
});

const animation = `${show} 150ms cubic-bezier(0.16, 1, 0.3, 1)`;

export const overlay = style({
  backgroundColor: publicVariables.color.placeholder,
  position: "fixed",
  inset: "0",
  animation,
});

export const wrapper = style({
  backgroundColor: publicVariables.color.background,
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "450px",
  maxHeight: "85vh",
  padding: "25px",
  animation,
  border: `1px solid ${publicVariables.color.secondary}`,
  boxSizing: "border-box",

  ":focus": {
    outline: "none",
  },
});

export const closeButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0",
  border: `1px solid ${publicVariables.color.smooth}`,
  userSelect: "none",
  lineHeight: "118%",

  ":hover": {
    cursor: "pointer",
    backgroundColor: publicVariables.color.soft,
  },

  ":active": {
    transform: "scale(.98)",
  },

  ":focus-visible": {
    outline: `4px solid ${publicVariables.color.smooth}`,
  },
});
