import { SlashID } from "@slashid/slashid";
import { init, ErrorBoundary } from "@sentry/react";
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
import { Flow, Error } from "../flow";
import { Card } from "../card";

import * as styles from "./app.css";
import { config } from "../../config";

export function App() {
  const isBrowser = !!globalThis.window;
  const [appState, setAppState] = useState<AppState>("initial");
  const sidRef = useRef<SlashID | undefined>(undefined);

  useEffect(() => {
    if (appState === "initial") {
      init({
        dsn: "https://6435e8a20ba8b61404fb4621d2aedd4a@o4505317722619904.ingest.sentry.io/4506275681075200",
      });

      sidRef.current = new SlashID({
        analyticsEnabled: false,
        sdkURL: config.sdkURL,
        baseURL: config.baseURL,
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
      <ErrorBoundary
        fallback={
          <Card>
            <Error type="error" />
          </Card>
        }
      >
        <AppContext.Provider value={state}>
          <TextProvider text={I18N[state.language]}>
            <main className={styles.app}>
              <Flow />
            </main>
          </TextProvider>
        </AppContext.Provider>
      </ErrorBoundary>
    </ThemeRoot>
  );
}
