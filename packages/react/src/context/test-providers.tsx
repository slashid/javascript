import React, { useCallback, useMemo } from "react";
import {
  SlashIDContext,
  ISlashIDContext,
  initialContextValue,
  Subscribe,
  Unsubscribe,
} from "./slash-id-context";
import { TextConfig } from "../components/text/constants";
import { TextContext } from "@slashid/react-primitives";
import { LoginConfiguration, LoginOptions } from "../domain/types";
import {
  createEventBuffer,
  EventBuffer,
} from "../components/form/event-buffer";

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
  __orgSwitchingState = { state: "idle" },
}) => {
  const [internalUser, setInternalUser] = React.useState(user);
  const eventBufferRef = React.useRef<EventBuffer | null>(null);

  const subscribe = useCallback<Subscribe>(
    (type, event) => {
      if (!sid) return;

      if (!eventBufferRef.current) {
        eventBufferRef.current = createEventBuffer({ sdk: sid });
      }

      // @ts-expect-error void types causing issues
      return eventBufferRef.current.subscribe(type, event);
    },
    [sid]
  );

  const unsubscribe = useCallback<Unsubscribe>(
    (type, event) => {
      if (!sid) return;

      if (!eventBufferRef.current) {
        eventBufferRef.current = createEventBuffer({ sdk: sid });
      }

      // @ts-expect-error void types causing issues
      return eventBufferRef.current.unsubscribe(type, event);
    },
    [sid]
  );

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
      subscribe,
      unsubscribe,
      __switchOrganizationInContext,
      __syncExternalState,
      __orgSwitchingState,
    }),
    [
      sid,
      sdkState,
      internalUser,
      anonymousUser,
      recover,
      logIn,
      mfa,
      subscribe,
      unsubscribe,
      __switchOrganizationInContext,
      __syncExternalState,
      __orgSwitchingState,
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
