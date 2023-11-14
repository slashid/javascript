import React from "react";
import { ConfigurationContext } from "../context/config-context";

export function useConfiguration() {
  const contextValue = React.useContext(ConfigurationContext);

  return contextValue;
}
