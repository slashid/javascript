import { Logo } from "@slashid/react-primitives";
import { createContext, useContext } from "react";
import { createI18n, type Translate } from "../../domain/i18n";

export type AppContextState = {
  logo: string | React.ReactNode;
  i18n: Translate;
};

export const initialAppContextState: AppContextState = {
  logo: <Logo />,
  i18n: createI18n("en"),
};

export const AppContext = createContext<AppContextState>(
  initialAppContextState
);

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  return appContext;
};
