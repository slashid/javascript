import React, { useMemo } from "react";
import {
  SlashIDContext,
  ISlashIDContext,
  initialContextValue,
} from "./slash-id-context";
import { TextConfig } from "../components/text/constants";
import { TextContext } from "@slashid/react-primitives";

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
  recover,
  __switchOrganizationInContext = async () => undefined,
}) => {
  const value = useMemo(
    () => ({
      ...initialContextValue,
      sid,
      sdkState: sdkState || "initial",
      user,
      recover: recover || (async () => undefined),
      ...(logIn ? { logIn } : {}),
      ...(mfa ? { mfa } : {}),
      __switchOrganizationInContext,
    }),
    [sid, sdkState, user, logIn, mfa, recover, __switchOrganizationInContext]
  );

  return (
    <SlashIDContext.Provider value={value}>{children}</SlashIDContext.Provider>
  );
};

export type TestTextProviderProps = {
  children: React.ReactNode;
  text: TextConfig;
};
export const TestTextProvider = ({ children, text }: TestTextProviderProps) => {
  return (
    <TextContext.Provider value={{ text }}>{children}</TextContext.Provider>
  );
};
