import { createContext, ReactNode, useMemo } from "react";
import { TextConfig } from "./types";

export interface ITextContext {
  text: TextConfig;
}

export const initialContextValue: ITextContext = {
  text: {},
};

export const TextContext = createContext<ITextContext>(initialContextValue);
TextContext.displayName = "SlashIDTextContext";

type Props = {
  text: TextConfig;
  children: ReactNode;
};

export const TextProvider: React.FC<Props> = ({ text, children }) => {
  const contextValue = useMemo(() => {
    return {
      text,
    };
  }, [text]);

  return (
    <TextContext.Provider value={contextValue}>{children}</TextContext.Provider>
  );
};
