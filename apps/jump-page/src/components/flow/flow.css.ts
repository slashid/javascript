import { publicVariables, theme } from "@slashid/react-primitives";
import { globalStyle, style } from "@vanilla-extract/css";

export const logo = style({
  width: 32,
  height: 32,
});

globalStyle(`${logo} > svg`, {
  height: 32,
  width: 32,
});

export const footer = style({
  width: "100%",
  marginTop: theme.space[8],
  textAlign: "center",
  color: publicVariables.color.placeholder,
});
