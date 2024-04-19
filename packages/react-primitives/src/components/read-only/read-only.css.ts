import { style } from "@vanilla-extract/css";
import { theme, publicVariables } from "../../main";

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
  fontWeight: theme.font.weight.semibold,
  color: publicVariables.color.foreground,
  backgroundColor: publicVariables.color.offset,
  lineHeight: "122%",
  overflow: "hidden",
  whiteSpace: "nowrap",
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
  top: 6,
  padding: 16,
  ":hover": {
    cursor: "pointer",
  },
});
