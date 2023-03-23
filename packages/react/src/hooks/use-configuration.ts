import type { Factor } from "@slashid/slashid";
import React from "react";
import { ConfigurationContext } from "../context/config-context";
import { TextConfig } from "../components/text/constants";

type UseConfigurationOptions = {
  factors?: Factor[];
  text?: Partial<TextConfig>;
};

export function useConfiguration({ factors, text }: UseConfigurationOptions) {
  const contextValue = React.useContext(ConfigurationContext);

  return {
    ...contextValue,
    text: {
      ...contextValue.text,
      ...(text ? text : {}),
    },
    factors: factors ? factors : contextValue.factors,
  };
}
