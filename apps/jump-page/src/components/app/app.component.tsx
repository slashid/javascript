import { Logo, ThemeRoot } from "@slashid/react-primitives";
import * as styles from "./app.css";
import { AppContext, initialAppContextState } from "./app.context";
import { useMemo } from "react";
import { createI18n, detectLanguage } from "../../domain/i18n";

export type Props = {
  children: React.ReactNode;
};

export function App({ children }: Props) {
  const config = useMemo(() => {
    if (!window) {
      return initialAppContextState;
    }

    return {
      // TODO read customisation props from the URL
      logo: <Logo />,
      i18n: createI18n(detectLanguage()),
    };
  }, []);

  return (
    <ThemeRoot theme="light">
      <AppContext.Provider value={config}>
        <main className={styles.app}>{children}</main>
      </AppContext.Provider>
    </ThemeRoot>
  );
}
