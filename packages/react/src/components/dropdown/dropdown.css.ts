import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const trigger = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  flexDirection: "column",
  width: "100%",
  // TODO: revisit this
  // minWidth: theme.input.minWidth,
  height: theme.input.height,
  gap: theme.space["0.5"],
  padding: `${theme.input.paddingVertical} ${theme.input.paddingHorizontal}`,
  boxSizing: "border-box",
  backgroundColor: publicVariables.color.offset,
  border: `1px solid ${publicVariables.color.subtle}`,
  borderRadius: publicVariables.border.radius,
  fontFamily: publicVariables.font.fontFamily,
  position: "relative",
  textAlign: "left",

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
  display: "grid",
  gridTemplateColumns: "auto 24px"
});

export const content = style({
  position: "relative",
  backgroundColor: publicVariables.color.panel,
  border: `1px solid ${publicVariables.color.subtle}`,
  boxShadow: theme.color.md,
  borderRadius: "20px",
  overflow: "hidden",
  zIndex: 1,
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
  columnGap: "8px",
  alignItems: "center",

  ":hover": {
    backgroundColor: publicVariables.color.soft,
    cursor: "pointer",
    border: "none",
    outline: "none",
  },
});

export const icon = style({
  position: "absolute",
  right: "16px",
  zIndex: 0
});

export const selectedIcon = style({
  height: "16px",
  marginLeft: "auto",
  justifySelf: "flex-end"
})