import { User } from "@slashid/slashid";
import { useMemo } from "react";
import {
  SlashIDContext,
  ISlashIDContext,
  initialContextValue,
} from "../context/slash-id-context";

type TestProviderProps = Partial<ISlashIDContext> & {
  children: React.ReactNode;
};

export const TEST_USER = new User(
  "eyJhbGciOiJSUzI1NiIsICJraWQiOiJ2RXBzRmcifQ.eyJhdXRoZW50aWNhdGVkX21ldGhvZHMiOlsiZW1haWxfbGluayJdLCAiZXhwIjoxNjY4Nzc1NjE3LCAiZmlyc3RfdG9rZW4iOmZhbHNlLCAiZ3JvdXBzIjpbXSwgImlhdCI6MTY2ODc2NzAxNywgImlzcyI6Imh0dHBzOi8vc2FuZGJveC5zbGFzaGlkLmRldiIsICJqdGkiOiIwMzliYmIyN2MwN2I2OWIyMTc2MmVjMGExYTljMmRjNSIsICJvaWQiOiJhZDUzOTllYS00ZTg4LWIwNGEtMTZjYS04Mjk1OGM5NTU3NDAiLCAidXNlcl9pZCI6InBpZDowMWU0M2YyNDE5ZmU5OTQ4NzlhNjQ1NjRjZDc2YWIzMGE4ZDJlYTk1ZTg5OTg3YzgxODVjZWY1YWI4ZjhhZGY4ZGU2NDNhMjg5YzoyIn0.tsyUk3guY29r-jb-Xw2htT0egEO3KUErDSlJu9F9Y_QQAf6Te_DmdPgnCKjR7pTGO1uKvYT6JKit7opyntOA4y_wIhymUOkW5mtX-fgyIF0Fkxx1JjGm4BcTE9rI1tH7DWG177yTzwJ2kv5OYvTknpn_QK8s6JzD1N5Yq11_VNf2dRN_NXb-0feqDGhXU7lR-oO7wqFlt37pzENQ7-tG3JDt9uCKqSbrtXqxTHGtg80ZY3FxXYYiHNC3v0nXV5aFRhxGvIIm9LgNkZwXkEtSecIqFHWJn2-ILuOFpvcmtmlZr8AxQyNMAKMt1fARf2LJy45qITI2IyVTndtDekT6HQ"
);

export const TestSlashIDProvider: React.FC<TestProviderProps> = ({
  sid,
  sdkState,
  user,
  children,
  logIn,
}) => {
  const value = useMemo(
    () => ({
      ...initialContextValue,
      sid,
      sdkState: sdkState || "initial",
      user,
      ...(logIn ? { logIn } : {}),
    }),
    [logIn, sdkState, sid, user]
  );

  return (
    <SlashIDContext.Provider value={value}>{children}</SlashIDContext.Provider>
  );
};
