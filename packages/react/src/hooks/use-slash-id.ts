import React from "react";
import { SlashIDContext } from "../context/slash-id-context";

export function useSlashID() {
  const contextValue = React.useContext(SlashIDContext);

  return contextValue;
}
