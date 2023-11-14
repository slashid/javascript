import { createGlobalTheme } from "@vanilla-extract/css";
import { publicVariables, lightTheme } from "../../theme/theme.css";

export const THEME_ROOT_CLASS_NAME = "sid-theme-root";

// side effect - listed in package.json "sideEffects"
createGlobalTheme(`.${THEME_ROOT_CLASS_NAME}`, publicVariables, lightTheme);
