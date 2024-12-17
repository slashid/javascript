import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "../../theme/theme.css";

export const trigger = style({
  display: "flex",
  alignItems: "end",
  justifyContent: "space-between",
  width: "100%",
  minWidth: theme.input.minWidth,
  height: theme.input.height,
  gap: theme.space["0.5"],
  padding: `${theme.input.paddingVertical} ${theme.input.paddingHorizontal}`,
  boxSizing: "border-box",
  backgroundColor: publicVariables.color.offset,
  border: `1px solid ${publicVariables.input.border.color}`,
  borderRadius: publicVariables.input.border.radius,
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
  lineHeight: "118%",
  color: publicVariables.input.label.color,
  position: "absolute",
  top: 12,
  left: 17,
});

export const input = style({
  width: "100%",
  fontSize: theme.font.size.base,
  fontWeight: theme.font.weight.semibold,
  color: publicVariables.color.foreground,
  display: "grid",
  gridTemplateColumns: "auto 24px",
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
  padding: "12px",
});

export const item = style({
  fontFamily: publicVariables.font.fontFamily,
  fontWeight: theme.font.weight.bold,
  fontSize: theme.font.size.base,
  lineHeight: "100%",
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

export const iconWrapper = style({
  position: "absolute",
  right: "16px",
  top: "22px",
});

export const icon = style({
  selectors: {
    [`${trigger}[data-state='open']  &`]: {
      transform: "rotate(180deg)",
    },
  },
});

export const selectedIcon = style({
  height: "16px",
  marginLeft: "auto",
  justifySelf: "flex-end",
});

export const wrapper = style({
  position: "relative",
});
