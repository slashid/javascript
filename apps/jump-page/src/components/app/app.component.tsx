import { SlashID } from "@slashid/slashid";
import * as Sentry from "@sentry/react";
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

Sentry.init({
  dsn: "https://6435e8a20ba8b61404fb4621d2aedd4a@o4505317722619904.ingest.sentry.io/4506275681075200",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
      <Sentry.ErrorBoundary
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
      </Sentry.ErrorBoundary>
    </ThemeRoot>
  );
}
