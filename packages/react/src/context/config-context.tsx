import { Factor } from "@slashid/slashid";
import { createContext, ReactNode, useMemo } from "react";
import { TEXT, TextConfig } from "../components/text/constants";
import { SlashID } from "../components/icon/slashid";
import { Theme } from "../theme/theme.css";

export type Logo = string | React.ReactNode;

export interface IConfigurationContext {
  text: TextConfig;
  factors: Factor[];
  logo: Logo;
  /**
   * @deprecated Set this on the SlashIDProvider instead using the themeProps prop.
   */
  theme: Theme;
  storeLastHandle: boolean;
  showBanner: boolean;
}

export const initialContextValue: IConfigurationContext = {
  text: TEXT,
  factors: [{ method: "webauthn" }, { method: "email_link" }],
  logo: <SlashID />,
  theme: "auto",
  storeLastHandle: false,
  showBanner: true,
};

export const ConfigurationContext =
  createContext<IConfigurationContext>(initialContextValue);
ConfigurationContext.displayName = "SlashIDConfigurationContext";

type Props = {
  text?: Partial<TextConfig>;
  factors?: Factor[];
  logo?: Logo;
  theme?: Theme;
  storeLastHandle?: boolean;
  showBanner?: boolean;
  children: ReactNode;
};

export const ConfigurationProvider: React.FC<Props> = ({
  text,
  factors,
  logo,
  theme,
  children,
  storeLastHandle,
  showBanner = true,
}) => {
  const contextValue = useMemo(() => {
    return {
      text: text ? { ...TEXT, ...text } : initialContextValue.text,
      factors: factors || initialContextValue.factors,
      logo: logo || initialContextValue.logo,
      theme: theme || initialContextValue.theme,
      storeLastHandle: storeLastHandle || initialContextValue.storeLastHandle,
      showBanner: showBanner,
    };
  }, [text, factors, logo, theme, storeLastHandle, showBanner]);

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
};
