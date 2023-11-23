import { publicVariables, theme } from "@slashid/react-primitives";
import { globalStyle, style } from "@vanilla-extract/css";

export const card = style({
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
  backgroundColor: publicVariables.color.panel,
  width: "465px",
  minHeight: "330px",
  padding: "32px 32px 16px 32px",
  boxSizing: "border-box",

  "@media": {
    "screen and (min-width: 768px)": {
      borderRadius: `calc(2 * ${publicVariables.border.radius})`,
    },
  },
});

export const header = style({
  marginBottom: theme.space[1],
});

export const footer = style({
  width: "100%",
  textAlign: "center",
});

export const logo = style({
  width: 32,
  height: 32,
});

globalStyle(`${logo} > svg`, {
  height: 32,
  width: 32,
});
