import { style } from "@vanilla-extract/css";
import { theme } from "../theme/theme.css";

const form = style({
  color: theme.color.brand,
});

export const styles = {
  form,
};
