import { style } from "@vanilla-extract/css";
import { theme, publicVariables } from "@slashid/react-primitives/src/theme/theme.css";

export const form = style({
  fontFamily: publicVariables.font.fontFamily,
  color: publicVariables.color.foreground,
  backgroundColor: publicVariables.color.panel,
  width: "100%",
  padding: "32px",
  boxSizing: "border-box",

  "@media": {
    "screen and (min-width: 768px)": {
      borderRadius: `calc(2 * ${publicVariables.border.radius})`,
    },
  },
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[1],
});

export const dropdownContent = style({
  width: "var(--radix-select-trigger-width)",
  marginTop: "4px",
});
