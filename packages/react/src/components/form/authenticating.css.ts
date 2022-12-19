import { style } from "@vanilla-extract/css";

export const retryPrompt = style({
  display: "flex",
});

export const oidcTitle = style({
  textTransform: "capitalize",
});

export const otpForm = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  margin: "28px 0",
  gap: "8px",
});
