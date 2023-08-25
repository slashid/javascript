import { clsx } from "clsx";
import {
  Theme,
  autoTheme,
  darkTheme,
  lightThemeVars,
  themeClass,
} from "../../theme/theme.css";
import { useLayoutEffect } from "react";

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
 * This component will apply the necessary class names to the <body> element.
 * That way the child components on all levels can use the theming properties.
 * This also helps with any components portaling out of the SlashIDProvider hierarchy.
 */
export function ThemeRoot({ children, theme = "light", className }: Props) {
  useLayoutEffect(() => {
    const themeRootClassNames = clsx(
      "sid-theme-root",
      `sid-theme-root__${theme}`,
      themeClass,
      {
        [darkTheme]: theme === "dark",
        [autoTheme]: theme === "auto",
        [lightThemeVars]: theme === "light",
      },
      className
    );

    document.body.classList.add(...themeRootClassNames.split(" "));
  }, [className, theme]);

  return <>{children}</>;
}
