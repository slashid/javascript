import { createTheme } from "@vanilla-extract/css";

export const [themeClass, theme] = createTheme({
  color: {
    brand: "blue",
  },
  font: {
    body: "arial",
  },
});
