import { style } from "@vanilla-extract/css";
import { publicVariables, theme } from "@slashid/react-primitives";

export const supportPrompt = style({
  width: "100%",
  marginBlock: theme.space[4],
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.semibold,
  color: publicVariables.color.tertiary,
  textAlign: "center",
});

export const supportCta = style({
  color: publicVariables.color.foreground,
  marginLeft: theme.space[1],
  textDecoration: "none",

  ":hover": {
    opacity: 0.8,
  },
});
