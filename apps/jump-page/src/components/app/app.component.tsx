import { Logo, TextProvider, ThemeRoot } from "@slashid/react-primitives";
import * as styles from "./app.css";
import { AppContext, initialAppContextState } from "./app.context";
import { useEffect, useMemo, useState } from "react";
import { I18N, detectLanguage } from "../../domain/i18n";
import { Flow } from "../flow";

export function App() {
  const isBrowser = !!globalThis.window;
  const [hydrated, setHydrated] = useState(false);

  // used to prevent hydration mismatch
  useEffect(() => {
    setHydrated(true);
  }, []);

  const config = useMemo(() => {
    // checking for hydration makes the first client side render the same as the one on the server side
    // language check and URL params can only be done on the client side so we need to wait for the first render
    if (!isBrowser || !hydrated) {
      return initialAppContextState;
    }

    return {
      // TODO read customisation props from the URL
      logo: <Logo />,
      language: detectLanguage(),
    };
  }, [isBrowser, hydrated]);

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
