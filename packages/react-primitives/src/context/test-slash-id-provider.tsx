import React, { useMemo } from "react";
import {
  SlashIDContext,
  ISlashIDContext,
  initialContextValue,
} from "../context/slash-id-context";

type TestProviderProps = Partial<ISlashIDContext> & {
  children: React.ReactNode;
};

export const TestSlashIDProvider: React.FC<TestProviderProps> = ({
  sid,
  sdkState,
  user,
  children,
  logIn,
  mfa,
  __switchOrganizationInContext = async () => undefined,
}) => {
  const value = useMemo(
    () => ({
      ...initialContextValue,
      sid,
      sdkState: sdkState || "initial",
      user,
      ...(logIn ? { logIn } : {}),
      ...(mfa ? { mfa } : {}),
      __switchOrganizationInContext,
    }),
    [logIn, mfa, sdkState, sid, user, __switchOrganizationInContext]
  );

  return (
    <SlashIDContext.Provider value={value}>{children}</SlashIDContext.Provider>
  );
};
