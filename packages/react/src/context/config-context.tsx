import { Factor } from "@slashid/slashid";
import { createContext, ReactNode, useMemo } from "react";
import { TEXT, TextConfig } from "../components/text/constants";

export interface IConfigurationContext {
  text: TextConfig;
  factors: Factor[];
}

export const initialContextValue: IConfigurationContext = {
  text: TEXT,
  factors: [{ method: "webauthn" }, { method: "email_link" }],
};

export const ConfigurationContext =
  createContext<IConfigurationContext>(initialContextValue);
ConfigurationContext.displayName = "SlashIDConfigurationContext";

type Props = {
  text?: Partial<TextConfig>;
  factors?: Factor[];
  children: ReactNode;
};

export const ConfigurationProvider: React.FC<Props> = ({
  text,
  factors,
  children,
}) => {
  const contextValue = useMemo(() => {
    return {
      text: text ? { ...TEXT, ...text } : initialContextValue.text,
      factors: factors || initialContextValue.factors,
    };
  }, [text, factors]);

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
};
