import { keyframes, style } from "@vanilla-extract/css";

// TODO swap with a generic one
export const retryPrompt = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "baseline",
});

export const prompt = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "baseline",
});

export const oidcTitle = style({
  textTransform: "capitalize",
});

export const otpForm = style({
  margin: "16px 0",
});

export const formInputs = style({
  margin: "24px 0",
});

export const passwordRecoveryPrompt = style({
  display: "flex",
  alignItems: "baseline",
  marginTop: "8px",
});

export const formInner = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const fadeIn = keyframes({
  "0%": { opacity: "0" },
  "100%": { opacity: "1" },
});

export const wrapper = style({
  animation: `${fadeIn} 0.3s`,
});

export const registerAuthenticatorForm = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const qrCode = style({
  margin: "24px auto",
  borderRadius: 16,
});

export const readOnly = style({
  marginTop: 12,
});
