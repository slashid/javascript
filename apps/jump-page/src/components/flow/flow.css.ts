import { publicVariables, theme } from "@slashid/react-primitives";
import { style } from "@vanilla-extract/css";

export const formInputs = style({
  margin: "24px 0",
});

export const passwordRecoveryPrompt = style({
  display: "flex",
  alignItems: "baseline",
  marginTop: "8px",
});

export const errorMessage = style({
  display: "block",
  marginTop: theme.space[2],
  color: publicVariables.color.error,
  fontWeight: "600",
  lineHeight: "122%",
});
