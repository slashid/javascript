import React from "react";
import { SlashIDContext } from "../context/SlashIDContext";

export function useSlashID() {
  const contextValue = React.useContext(SlashIDContext);

  return contextValue;
}
