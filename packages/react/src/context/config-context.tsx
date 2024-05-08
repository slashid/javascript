import { createContext, ReactNode, useMemo } from "react";
import { SlashID, TextProvider } from "@slashid/react-primitives";
import { TEXT, TextConfig } from "../components/text/constants";
import { FactorConfiguration } from "../domain/types";
import { urlValidator } from "../utils/css-validation";

export type Logo = string | React.ReactNode;

export interface IConfigurationContext {
  text: TextConfig;
  factors: FactorConfiguration[];
  logo: Logo;
  storeLastHandle: boolean;
  showBanner: boolean;
  defaultCountryCode: string;
  /** If defined the form in the error state will render a CTA with this link */
  supportURL: undefined | string;
}

export const initialContextValue: IConfigurationContext = {
  text: TEXT,
  factors: [{ method: "webauthn" }, { method: "email_link" }],
  logo: <SlashID />,
  storeLastHandle: false,
  showBanner: true,
  defaultCountryCode: "US",
  supportURL: undefined,
};

export const ConfigurationContext =
  createContext<IConfigurationContext>(initialContextValue);
ConfigurationContext.displayName = "SlashIDConfigurationContext";

type Props = {
  text?: Partial<TextConfig>;
  factors?: FactorConfiguration[];
  logo?: Logo;
  storeLastHandle?: boolean;
  showBanner?: boolean;
  defaultCountryCode?: string;
  supportURL?: string;
  children: ReactNode;
};

export const ConfigurationProvider: React.FC<Props> = ({
  text,
  supportURL,
  children,
  ...props
}) => {
  const contextValue = useMemo(() => {
    return {
      ...initialContextValue,
      ...props,
      text: text ? { ...TEXT, ...text } : initialContextValue.text,
      supportURL:
        supportURL && urlValidator(supportURL)
          ? supportURL
          : initialContextValue.supportURL,
    };
  }, [props, supportURL, text]);

  return (
    <ConfigurationContext.Provider value={contextValue}>
      <TextProvider text={contextValue.text}>{children}</TextProvider>
    </ConfigurationContext.Provider>
  );
};
