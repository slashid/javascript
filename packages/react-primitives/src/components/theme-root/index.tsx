import { clsx } from "clsx";
import {
  THEME_ROOT_CLASS_NAME,
  Theme,
  autoThemeVars,
  darkThemeVars,
  lightThemeVars,
  themeClass,
} from "../../theme/theme.css";
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
    THEME_ROOT_CLASS_NAME,
    `${THEME_ROOT_CLASS_NAME}__${theme}`,
    themeClass,
    {
      [darkThemeVars]: theme === "dark",
      [autoThemeVars]: theme === "auto",
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
export const ServerThemeRoot = ({ children }: Props) => {
  return <div className={createClassNames({ theme: "light" })}>{children}</div>;
};

const ClientThemeRoot = ({ children, theme = "light", className }: Props) => {
  // used to fix a hydration mismatch between server and client side
  const [hydrated, setHydrated] = React.useState(false);

  // this effect runs client side only
  useLayoutEffect(() => {
    if (!hydrated) {
      setHydrated(true);
    }
  }, [className, hydrated, theme]);

  useLayoutEffect(() => {
    if (hydrated) {
      setThemeRootClassNames({ theme, className });
    }
  }, [className, hydrated, theme]);

  return hydrated ? (
    <>{children}</>
  ) : (
    <ServerThemeRoot>{children}</ServerThemeRoot>
  );
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
