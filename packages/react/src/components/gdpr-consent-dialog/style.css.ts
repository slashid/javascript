import { createVar, style } from "@vanilla-extract/css";
import { publicVariables } from "../../theme/theme.css";

const margin = createVar();

export const dialog = style({
  vars: {
    [margin]: "12px",
  },
  backgroundColor: publicVariables.color.panel,
  position: "fixed",
  bottom: margin,
  right: margin,
  top: "unset",
  left: "unset",
  transform: "unset",
  maxWidth: "unset",
  maxHeight: "90vh",
  width: "398px",

  "@media": {
    "screen and (max-width: 480px)": {
      vars: {
        [margin]: "20px",
      },
      width: `calc(100% - (${margin} * 2))`,
    },
  },
});

export const dialogTrigger = style({
  vars: {
    [margin]: "12px",
  },
  position: "fixed",
  bottom: margin,
  right: margin,
  display: "grid",
  placeItems: "center",
  width: "46px",
  height: "38px",
  padding: "12px 16px",
  border: "none",
  borderRadius: "14px",
  boxSizing: "border-box",
  backgroundColor: publicVariables.color.foreground,

  "@media": {
    "screen and (max-width: 480px)": {
      vars: {
        [margin]: "20px",
      },
    },
  },

  ":hover": {
    cursor: "pointer",
    backgroundColor: publicVariables.color.primaryHover,
  },

  ":active": {
    transform: "scale(.98)",
  },

  ":focus-visible": {
    outline: `4px solid ${publicVariables.color.smooth}`,
  },
});

export const title = style({
  margin: "12px 0 24px 0",
  padding: "0 16px",
});

export const content = style({
  borderTop: `1px solid ${publicVariables.color.subtle}`,
  borderBottom: `1px solid ${publicVariables.color.subtle}`,
  background: publicVariables.color.panel,
  maxHeight: "30vh",
  overflowY: "auto",
  padding: "0 16px",
});

export const trigger = style({
  flex: "1",
  padding: "15px 0",
});

export const footer = style({
  display: "flex",
  gap: "8px",
  marginTop: "24px",
  padding: "0 16px 16px 16px",

  "@media": {
    "screen and (max-width: 480px)": {
      flexDirection: "column",
    },
  },
});
