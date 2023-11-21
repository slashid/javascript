import { Logo, TextProvider, ThemeRoot } from "@slashid/react-primitives";
import * as styles from "./app.css";
import { AppContext, initialAppContextState } from "./app.context";
import { useMemo } from "react";
import { I18N, detectLanguage } from "../../domain/i18n";
import { Flow } from "../flow";

export function App() {
  const isBrowser = !!globalThis.window;
  const config = useMemo(() => {
    if (!isBrowser) {
      return initialAppContextState;
    }

    return {
      // TODO read customisation props from the URL
      logo: <Logo />,
      language: detectLanguage(),
    };
  }, [isBrowser]);

  return (
    <ThemeRoot theme="light">
      <AppContext.Provider value={config}>
        <TextProvider text={I18N[config.language]}>
          <main className={styles.app}>
            <Flow />
          </main>
        </TextProvider>
      </AppContext.Provider>
    </ThemeRoot>
  );
}
