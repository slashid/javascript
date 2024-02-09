import { PropsWithChildren } from "react";
import { useConfiguration } from "../../hooks/use-configuration";
import { ConfigurationProvider } from "../../context/config-context";
import { TextConfig } from "../text/constants";
import { FactorConfiguration } from "../../domain/types";

export type ConfigurationOverridesProps = {
  factors?: FactorConfiguration[];
  text?: Partial<TextConfig>;
};

export function ConfigurationOverrides({
  factors,
  text,
  children,
}: PropsWithChildren<ConfigurationOverridesProps>) {
  const config = useConfiguration();

  if (!factors && !text) {
    return <>{children}</>;
  }

  return (
    <ConfigurationProvider
      {...config}
      text={{
        ...config.text,
        ...text,
      }}
      factors={factors ? factors : config.factors}
    >
      {children}
    </ConfigurationProvider>
  );
}
