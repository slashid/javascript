import { Logo } from "@slashid/react-primitives";
import { createContext, useContext } from "react";
import { type Language } from "../../domain/i18n";

export type AppContextState = {
  logo: string | React.ReactNode;
  language: Language;
};

export const initialAppContextState: AppContextState = {
  logo: <Logo />,
  language: "en",
};

export const AppContext = createContext<AppContextState>(
  initialAppContextState
);

export const useAppContext = () => {
  const appContext = useContext(AppContext);

  return appContext;
};
