import { createContext, ReactNode, useMemo } from "react";
import { TEXT, TextConfig } from "../components/text/constants";

export const initialContextValue = {
  text: TEXT,
};

export interface IConfigurationContext {
  text: TextConfig;
}

export const ConfigurationContext =
  createContext<IConfigurationContext>(initialContextValue);
ConfigurationContext.displayName = "SlashIDConfigurationContext";

type Props = {
  text?: Partial<TextConfig>;
  children: ReactNode;
};

export const ConfigurationProvider: React.FC<Props> = ({
  text,
  children,
}) => {
  const contextValue = useMemo(() => {
    if (!text) {
      return { text: TEXT };
    }
    return {
      text: { ...TEXT, ...text },
    };
  }, [text]);

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
};
