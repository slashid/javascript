import { createVar, style } from "@vanilla-extract/css";
import { publicVariables } from "../../theme/theme.css";

const margin = createVar();

export const dialog = style({
  vars: {
    [margin]: "12px",
  },
  transform: "unset",
  top: "unset",
  left: "unset",
  bottom: margin,
  right: margin,
  maxHeight: "542px",
  maxWidth: "384px",
  display: "grid",
  gridTemplateRows: "auto auto 1fr auto",
  backgroundColor: publicVariables.color.panel,

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
  overflowY: "auto",
  padding: "0 16px",
  borderTop: `1px solid ${publicVariables.color.subtle}`,
  borderBottom: `1px solid ${publicVariables.color.subtle}`,
  background: publicVariables.color.auxiliary,
});

export const contentWrapper = style({
  position: "relative",
});

export const errorWrapper = style({
  position: "absolute",
  left: "0",
  top: "0",
  width: "100%",
  height: "100%",
  display: "grid",
  placeContent: "center",
  gap: "6px",
  textAlign: "center",
  background: publicVariables.color.auxiliary,
});

export const accordionItem = style({
  borderBottom: `1px solid ${publicVariables.color.subtle}`,
});

export const accordionTrigger = style({
  padding: "24px 0",
});

export const accordionContent = style({
  paddingBottom: "24px",
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
