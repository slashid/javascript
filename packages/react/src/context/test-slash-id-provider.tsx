import { useMemo } from "react";
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
}) => {
  const value = useMemo(
    () => ({
      ...initialContextValue,
      sid,
      sdkState: sdkState || "initial",
      user,
    }),
    [sdkState, sid, user]
  );

  return (
    <SlashIDContext.Provider value={value}>{children}</SlashIDContext.Provider>
  );
};
