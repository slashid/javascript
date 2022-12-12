import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const trigger = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  flexDirection: "column",
  width: "fit-content",
  minWidth: theme.input.minWidth,
  height: theme.input.height,
  padding: `0 ${theme.input.paddingHorizontal}`,
  boxSizing: "border-box",
  border: `1px solid ${publicVariables.color.subtle}`,
  borderRadius: publicVariables.border.radius,
  fontFamily: publicVariables.font.fontFamily,

  ":active": {
    border: `1px solid ${publicVariables.color.tertiary}`,
    outline: "none",
  },
  ":hover": {
    border: `1px solid ${publicVariables.color.placeholder}`,
    cursor: "pointer",
    outline: "none",
  },
  ":focus": {
    border: `1px solid ${publicVariables.color.tertiary}`,
    outline: "none",
  },
});

export const label = style({
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.semibold,
  color: publicVariables.color.contrast,
});

export const input = style({
  width: "100%",
  fontSize: theme.font.size.base,
  fontWeight: theme.font.weight.semibold,
  color: publicVariables.color.foreground,
  display: "flex",
  justifyContent: "space-between",
});

export const content = style({
  position: "relative",
  backgroundColor: theme.color.panel,
  border: `1px solid ${publicVariables.color.subtle}`,
  boxShadow: theme.color.md,
  borderRadius: "20px",
  overflow: "hidden",
});

export const viewport = style({
  padding: "12px 24px",
});

export const item = style({
  fontFamily: publicVariables.font.fontFamily,
  fontWeight: theme.font.weight.bold,
  fontSize: theme.font.size.base,
  color: publicVariables.color.foreground,
  borderRadius: "12px",
  padding: "16px 12px",
  display: "flex",
  justifyContent: "space-between",

  ":hover": {
    backgroundColor: publicVariables.color.soft,
    cursor: "pointer",
    border: "none",
    outline: "none",
  },
});

export const icon = style({
  position: "relative",
  top: "-8px",
});
