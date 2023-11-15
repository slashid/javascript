import { clsx } from "clsx";
import {
  Theme,
  autoTheme,
  darkTheme,
  lightThemeVars,
  themeClass,
} from "@slashid/react-primitives/src/theme/theme.css";
import { useLayoutEffect } from "react";
import React from "react";
import { isBrowser } from "../../browser/is-browser";

export type ThemeProps = {
  theme?: Theme;
  className?: string;
};

type Props = {
  children: React.ReactNode;
  theme?: ThemeProps["theme"];
  className?: ThemeProps["className"];
};

function createClassNames({ theme, className }: ThemeProps) {
  return clsx(
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
}

function setThemeRootClassNames({ theme, className }: ThemeProps) {
  const themeRootClassNames = createClassNames({ theme, className });

  document.body.classList.add(...themeRootClassNames.split(" "));
}

/**
 * We cannot rely on useLayoutEffect to set the correct class names on the <body> element server side.
 */
const ServerThemeRoot = ({ children }: Props) => {
  return <>{children}</>;
};

const ClientThemeRoot = ({ children, theme = "light", className }: Props) => {
  // this effect runs client side only
  useLayoutEffect(() => {
    setThemeRootClassNames({ theme, className });
  }, [className, theme]);

  return <>{children}</>;
};

/**
 * This component will apply the necessary class names to the <body> element.
 * That way the child components on all levels can use the theming properties.
 * This also helps with any components portaling out of the SlashIDProvider hierarchy.
 */
export function ThemeRoot({ children, theme = "light", className }: Props) {
  if (!isBrowser()) {
    return <ServerThemeRoot>{children}</ServerThemeRoot>;
  }

  return (
    <ClientThemeRoot theme={theme} className={className}>
      {children}
    </ClientThemeRoot>
  );
}
