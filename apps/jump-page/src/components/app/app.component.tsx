import { SlashID } from "@slashid/slashid";
import { Logo, TextProvider, ThemeRoot } from "@slashid/react-primitives";

import {
  AppContext,
  initialAppContextState,
  type AppState,
  type AppContextState,
  type AppReadyState,
} from "./app.context";
import { useEffect, useMemo, useRef, useState } from "react";
import { I18N, detectLanguage } from "../../domain/i18n";
import { Flow } from "../flow";

import * as styles from "./app.css";

export function App() {
  const isBrowser = !!globalThis.window;
  const [appState, setAppState] = useState<AppState>("initial");
  const sidRef = useRef<SlashID | undefined>(undefined);

  useEffect(() => {
    if (appState === "initial") {
      sidRef.current = new SlashID({
        analyticsEnabled: false,
      });

      setAppState("ready");
    }
  }, [appState]);

  const state: AppContextState = useMemo(() => {
    // checking for hydration makes the first client side render the same as the one on the server side
    // language check and URL params can only be done on the client side so we need to wait for the first render
    if (!isBrowser || appState == "initial") {
      return initialAppContextState;
    }

    const appReadyState: AppReadyState = {
      // TODO read customisation props from the URL
      logo: <Logo />,
      language: detectLanguage(),
      state: appState,
      sdk: sidRef.current as SlashID,
    };

    return appReadyState;
  }, [appState, isBrowser]);

  return (
    <ThemeRoot theme="light">
      <AppContext.Provider value={state}>
        <TextProvider text={I18N[state.language]}>
          <main className={styles.app}>
            <Flow />
          </main>
        </TextProvider>
      </AppContext.Provider>
    </ThemeRoot>
  );
}
