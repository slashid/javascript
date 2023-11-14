import React, { useMemo } from "react";
import { ISlashIDContext, SlashIDContext } from "../context/slash-id-context";

interface UseSlashID extends ISlashIDContext {
  isLoading: boolean
  isAuthenticated: boolean
}

export function useSlashID(): UseSlashID {
  const contextValue = React.useContext(SlashIDContext);
  const isLoading = useMemo(() => contextValue.sdkState !== 'ready', [contextValue.sdkState]);
  const isAuthenticated = useMemo(() => contextValue.user !== undefined, [contextValue.user]);

  return {
    ...contextValue,
    isLoading,
    isAuthenticated
  };
}
