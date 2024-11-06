import React, { useMemo } from "react";
import {
  SlashIDContext,
  ISlashIDContext,
  initialContextValue,
} from "./slash-id-context";
import { TextConfig } from "../components/text/constants";
import { TextContext } from "@slashid/react-primitives";
import { LoginConfiguration, LoginOptions } from "../domain/types";

type TestProviderProps = Partial<ISlashIDContext> & {
  children: React.ReactNode;
};

export const TestSlashIDProvider: React.FC<TestProviderProps> = ({
  sid,
  sdkState,
  user,
  anonymousUser,
  children,
  logIn,
  mfa,
  recover,
  __switchOrganizationInContext = async () => undefined,
  __syncExternalState = async () => undefined,
}) => {
  const [internalUser, setInternalUser] = React.useState(user);

  const value = useMemo(
    () => ({
      ...initialContextValue,
      sid,
      sdkState: sdkState || "initial",
      user: internalUser,
      anonymousUser,
      recover: recover || (async () => undefined),
      ...(logIn
        ? {
            logIn: async (
              config: LoginConfiguration,
              options?: LoginOptions
            ) => {
              const newUser = await logIn(config, options);
              setInternalUser(newUser);
              return newUser;
            },
          }
        : {}),
      ...(mfa ? { mfa } : {}),
      __switchOrganizationInContext,
      __syncExternalState,
    }),
    [
      sid,
      sdkState,
      internalUser,
      anonymousUser,
      recover,
      logIn,
      mfa,
      __switchOrganizationInContext,
      __syncExternalState,
    ]
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
