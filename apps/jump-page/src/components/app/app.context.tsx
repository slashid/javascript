import { createContext, useContext } from "react";
import { Logo } from "@slashid/react-primitives";
import type { SlashID } from "@slashid/slashid";

import { type Language } from "../../domain/i18n";

export type AppState = "initial" | "ready";

type AppConfig = {
  logo: string | React.ReactNode;
  language: Language;
};

export type AppInitialState = AppConfig & {
  state: "initial";
  sdk: undefined;
};

export type AppReadyState = AppConfig & {
  state: "ready";
  sdk: SlashID;
};

export type AppContextState = AppInitialState | AppReadyState;

export const initialAppContextState: AppContextState = {
  logo: <Logo />,
  language: "en",
  state: "initial",
  sdk: undefined,
};

export const AppContext = createContext<AppContextState>(
  initialAppContextState
);

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  return appContext;
};
