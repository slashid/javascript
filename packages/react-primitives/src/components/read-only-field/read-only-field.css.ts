import { style } from "@vanilla-extract/css";
import { theme, publicVariables } from "../../theme/theme.css";

export const wrapper = style({
  position: "relative",
  width: "100%",
  display: "flex",
  overflow: "hidden",
});

export const field = style({
  all: "unset",
  width: "100%",
  padding: "12px 16px",
  borderRadius: 16,
  fontFamily: "inherit",
  border: "none",
  outline: "none",
  fontSize: theme.font.size.base,
  fontWeight: theme.font.weight.medium,
  color: publicVariables.color.foreground,
  backgroundColor: publicVariables.color.offset,
  lineHeight: "150%",
  overflow: "hidden",
  whiteSpace: "pre-line",
  textOverflow: "ellipsis",
  touchAction: "none",
});

export const fieldWithLabel = style({
  paddingTop: 28,
});

export const fieldWithCopy = style({
  paddingRight: 44,
});

export const label = style({
  position: "absolute",
  left: "16px",
  top: "12px",
  fontFamily: "inherit",
  fontSize: "12px",
  fontWeight: 600,
  color: publicVariables.color.contrast,
});

export const copyButton = style({
  all: "unset",
  position: "absolute",
  right: 0,
  top: 0,
  padding: 16,
  ":hover": {
    cursor: "pointer",
  },
});

export const copyButtonWithLabel = style({
  top: 6,
});
