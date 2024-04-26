import { globalStyle, style } from "@vanilla-extract/css";

export const recoveryCodes = style({
  marginTop: 24,
});

globalStyle(`${recoveryCodes} > div`, {
  display: "grid",
  gridTemplateColumns: "min-content auto",
  gap: "4px 40px",
  fontFamily: "monospace",
});
