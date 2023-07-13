import { FactorMethod, User } from "@slashid/slashid";
import React, { useMemo } from "react";
import {
  SlashIDContext,
  ISlashIDContext,
  initialContextValue,
  SDKState,
} from "../context/slash-id-context";

type TestProviderProps = Partial<ISlashIDContext> & {
  children: React.ReactNode;
};

export const TEST_ORG_ID = "ad5399ea-4e88-b04a-16ca-82958c955740";
export const TEST_PERSON_ID =
  "pid:01e43f2419fe994879a64564cd76ab30a8d2ea95e89987c8185cef5ab8f8adf8de643a289c:2";

const TEST_TOKEN_HEADER = "eyJhbGciOiJSUzI1NiIsICJraWQiOiJ2RXBzRmcifQ";
const TEST_TOKEN_PAYLOAD_DECODED = {
  authenticated_methods: ["email_link"],
  exp: 1668775617,
  first_token: false,
  groups: [],
  iat: 1668767017,
  iss: "https://sandbox.slashid.dev",
  jti: "039bbb27c07b69b21762ec0a1a9c2dc5",
  oid: TEST_ORG_ID,
  person_id: TEST_PERSON_ID,
};

const TEST_TOKEN_SIGNATURE =
  "tsyUk3guY29r-jb-Xw2htT0egEO3KUErDSlJu9F9Y_QQAf6Te_DmdPgnCKjR7pTGO1uKvYT6JKit7opyntOA4y_wIhymUOkW5mtX-fgyIF0Fkxx1JjGm4BcTE9rI1tH7DWG177yTzwJ2kv5OYvTknpn_QK8s6JzD1N5Yq11_VNf2dRN_NXb-0feqDGhXU7lR-oO7wqFlt37pzENQ7-tG3JDt9uCKqSbrtXqxTHGtg80ZY3FxXYYiHNC3v0nXV5aFRhxGvIIm9LgNkZwXkEtSecIqFHWJn2-ILuOFpvcmtmlZr8AxQyNMAKMt1fARf2LJy45qITI2IyVTndtDekT6HQ";

export const TEST_TOKEN = [
  TEST_TOKEN_HEADER,
  btoa(JSON.stringify(TEST_TOKEN_PAYLOAD_DECODED)),
  TEST_TOKEN_SIGNATURE,
].join(".");

export const TEST_USER = new User(TEST_TOKEN);

type CreateTestUserOptions = {
  authMethods: FactorMethod[];
};

/**
 * Creates new User instance.
 * NOTE: This function DOES NOT use or generate a valid token, only one that is easily decoded
 * for the purpose of testing the SDK. To be used in the tests ONLY.
 *
 * @param options CreateTestUserOptions
 * @returns User
 */
export function createTestUser({ authMethods }: CreateTestUserOptions): User {
  const token = [
    TEST_TOKEN_HEADER,
    btoa(
      JSON.stringify({
        ...TEST_TOKEN_PAYLOAD_DECODED,
        authenticated_methods: authMethods,
      })
    ),
    TEST_TOKEN_SIGNATURE,
  ].join(".");

  return new User(token);
}

export const TestSlashIDProvider: React.FC<TestProviderProps> = ({
  sid,
  sdkState,
  user,
  children,
  logIn,
  mfa,
}) => {
  const value = useMemo(
    () => ({
      ...initialContextValue,
      sid,
      sdkState: sdkState || SDKState.Initial,
      user,
      ...(logIn ? { logIn } : {}),
      ...(mfa ? { mfa } : {}),
    }),
    [logIn, mfa, sdkState, sid, user]
  );

  return (
    <SlashIDContext.Provider value={value}>{children}</SlashIDContext.Provider>
  );
};
