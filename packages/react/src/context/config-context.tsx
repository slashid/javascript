import { Factor } from "@slashid/slashid";
import { createContext, ReactNode, useMemo } from "react";
import { TEXT, TextConfig } from "../components/text/constants";
import { SlashID } from "../components/icon/slashid";

export type Logo = string | React.ReactNode;

export type Theme = "light" | "dark" | "auto";
export interface IConfigurationContext {
  text: TextConfig;
  factors: Factor[];
  logo: Logo;
  theme: Theme;
}

export const initialContextValue: IConfigurationContext = {
  text: TEXT,
  factors: [{ method: "webauthn" }, { method: "email_link" }],
  logo: <SlashID />,
  theme: "auto",
};

export const ConfigurationContext =
  createContext<IConfigurationContext>(initialContextValue);
ConfigurationContext.displayName = "SlashIDConfigurationContext";

type Props = {
  text?: Partial<TextConfig>;
  factors?: Factor[];
  logo?: Logo;
  theme?: Theme;
  children: ReactNode;
};

export const ConfigurationProvider: React.FC<Props> = ({
  text,
  factors,
  logo,
  theme,
  children,
}) => {
  const contextValue = useMemo(() => {
    return {
      text: text ? { ...TEXT, ...text } : initialContextValue.text,
      factors: factors || initialContextValue.factors,
      logo: logo || initialContextValue.logo,
      theme: theme || initialContextValue.theme,
    };
  }, [text, factors, logo, theme]);

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
};
