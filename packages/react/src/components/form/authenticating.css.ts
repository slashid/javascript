import { style } from "@vanilla-extract/css";

export const retryPrompt = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "baseline",
});

export const oidcTitle = style({
  textTransform: "capitalize",
});

export const otpForm = style({
  margin: "28px 0",
});

export const otpFormSection = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: "8px",
});
