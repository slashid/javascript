import { keyframes, style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

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
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "50vw",
  maxHeight: "80vh",
  boxSizing: "border-box",
  borderRadius: "20px",
  animation,
  backgroundColor: publicVariables.color.panel,
  boxShadow: theme.color.md,
});

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 16px 0 16px",
});

export const closeButton = style({
  all: "unset",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "16px",
  height: "16px",
  borderRadius: "50%",

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
