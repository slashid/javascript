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
  padding: "12px 16px",
  borderRadius: "14px",

  "@media": {
    "screen and (max-width: 480px)": {
      vars: {
        [margin]: "20px",
      },
    },
  },
});

export const title = style({
  margin: "12px 0 24px 0",
  padding: "0 16px",
});

export const content = style({
  display: "grid",
  maxHeight: "30vh",
  minHeight: "304px",
  overflowY: "auto",
  padding: "0 16px",
  borderTop: `1px solid ${publicVariables.color.subtle}`,
  borderBottom: `1px solid ${publicVariables.color.subtle}`,
  background: publicVariables.color.auxiliary,
});

export const error = style({
  display: "grid",
  placeContent: "center",
  gap: "6px",
  textAlign: "center",
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

export const saveButton = style({
  minWidth: "130px",
});
