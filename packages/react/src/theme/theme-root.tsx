import { clsx } from "clsx";
import { Theme, autoTheme, darkTheme, themeClass } from "./theme.css";

export type ThemeProps = {
  theme?: Theme;
  className?: string;
};

type Props = {
  children: React.ReactNode;
  theme?: ThemeProps["theme"];
  className?: ThemeProps["className"];
};

/**
 * This component is to be rendered as close as the app root.
 * It sets the proper class names so that child components on all levels can use the theming properties.
 */
export function ThemeRoot({ children, theme = "light", className }: Props) {
  return (
    <div
      className={clsx(
        "sid-theme-root",
        `sid-theme-root__${theme}`,
        themeClass,
        { [darkTheme]: theme === "dark", [autoTheme]: theme === "auto" },
        className
      )}
    >
      {children}
    </div>
  );
}
