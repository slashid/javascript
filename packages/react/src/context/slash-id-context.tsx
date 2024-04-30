import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnonymousUser,
  PersonHandleType,
  SlashID,
  SlashIDEnvironment,
  User,
} from "@slashid/slashid";
import {
  ThemeProps,
  ThemeRoot,
  MemoryStorage,
  CookieStorage,
} from "@slashid/react-primitives";
import { LogIn, MFA, Recover } from "../domain/types";
import { SDKState } from "../domain/sdk-state";
import { applyMiddleware } from "../middleware";
import { isAnonymous } from "../domain/user";
import { sequence } from "../components/utils";

export type StorageOption = "memory" | "localStorage" | "cookie";

export interface SlashIDProviderProps {
  oid: string;
  initialToken?: string;
  tokenStorage?: StorageOption;
  /**
   * The environment to connect to - either "production" or "sandbox".
   * @default "production"
   *
   * To use a custom environment, pass an object with the following shape:
   * @example
   * environment: {
   *  baseURL: "https://{YOUR_CUSTOM_API_DOMAIN}}",
   *  sdkURL: "https://{YOUR_CUSTOM_SDK_DOMAIN}}/sdk.html"
   * }
   *
   */
  environment?: SlashIDEnvironment;
  /**
   * @deprecated Use the `environment` prop instead.
   */
  baseApiUrl?: string;
  /**
   * @deprecated Use the `environment` prop instead.
   */
  sdkUrl?: string;
  analyticsEnabled?: boolean;
  /**
   * Anonymous users allow you to perform operations
   * on users who have not signed-up or logged-in,
   * using the same API as regular users.
   *
   * Use anonymous users to read & set user attributes, store
   * GDPR consent, track sign-up conversions, and build a
   * fingerprint of users who simply never sign-up.
   *
   * When the anonymous users signs up, or signs in, their
   * anonymous user is upgraded to a full user, and their
   * pre-login data is transferred.
   */
  anonymousUsersEnabled?: boolean;
  themeProps?: ThemeProps;
  children: ReactNode;
}

export interface ISlashIDContext {
  sid: SlashID | undefined;
  user: User | undefined;
  anonymousUser: AnonymousUser | undefined;
  sdkState: SDKState;
  logOut: () => undefined;
  logIn: LogIn;
  mfa: MFA;
  recover: Recover;
  validateToken: (token: string) => Promise<boolean>;
  __switchOrganizationInContext: ({ oid }: { oid: string }) => Promise<void>;
}

export const initialContextValue = {
  sid: undefined,
  user: undefined,
  anonymousUser: undefined,
  sdkState: "initial" as const,
  logOut: () => undefined,
  logIn: () => Promise.reject("NYI"),
  mfa: () => Promise.reject("NYI"),
  recover: () => Promise.reject("NYI"),
  validateToken: async () => false,
  __switchOrganizationInContext: async () => undefined,
};

export const SlashIDContext =
  createContext<ISlashIDContext>(initialContextValue);
SlashIDContext.displayName = "SlashIDContext";

const STORAGE_TOKEN_KEY = "@slashid/USER_TOKEN";

const createStorage = (storageType: StorageOption) => {
  switch (storageType) {
    case "memory":
      return new MemoryStorage();
    case "localStorage":
      return window.localStorage;
    case "cookie":
      return new CookieStorage();
    default:
      return new MemoryStorage();
  }
};

export const SlashIDProvider = ({
  oid: initialOid,
  initialToken,
  tokenStorage = "memory",
  environment,
  baseApiUrl,
  sdkUrl,
  analyticsEnabled,
  anonymousUsersEnabled = false,
  themeProps,
  children,
}: SlashIDProviderProps) => {
  const [oid, setOid] = useState(initialOid);
  const [token, setToken] = useState(initialToken);
  const [state, setState] = useState<SDKState>(initialContextValue.sdkState);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [anonymousUser, setAnonymousUser] = useState<AnonymousUser | undefined>(
    undefined
  );
  const storageRef = useRef<Storage | undefined>(undefined);
  const sidRef = useRef<SlashID | undefined>(undefined);

  /**
   * Restarts the React SDK lifecycle with a new
   * organizational context
   */
  const __switchOrganizationInContext = useCallback(
    async ({ oid: newOid }: { oid: string }) => {
      if (!user) return;

      const newToken = await user.getTokenForOrganization(newOid);

      setToken(newToken);
      setOid(newOid);
      setState("initial");
    },
    [user]
  );

  const storeUser = useCallback(
    (newUser: User) => {
      if (state === "initial") {
        return;
      }

      setUser(newUser);
      storageRef.current?.setItem(STORAGE_TOKEN_KEY, newUser.token);

      try {
        sidRef.current?.getAnalytics().identify(newUser);
      } catch {
        // fail silently
      }

      if (newUser.oid !== oid) {
        __switchOrganizationInContext({ oid: newUser.oid });
      }
    },
    [state, __switchOrganizationInContext, oid]
  );

  const storeAnonymousUser = useCallback(
    (anonUser: AnonymousUser) => {
      if (!anonymousUsersEnabled || state === "initial") {
        return;
      }

      setAnonymousUser(anonUser);
      storageRef.current?.setItem(STORAGE_TOKEN_KEY, anonUser.token);

      try {
        sidRef.current?.getAnalytics().identify(anonUser);
      } catch {
        // fail silently
      }
    },
    [anonymousUsersEnabled, state]
  );

  const clearAnonymousUser = useCallback(() => {
    if (!anonymousUsersEnabled || state === "initial") {
      return;
    }

    storageRef.current?.removeItem(STORAGE_TOKEN_KEY);

    setAnonymousUser(undefined);
  }, [anonymousUsersEnabled, state]);

  const logOut = useCallback((): undefined => {
    if (state === "initial") {
      return;
    }

    if (!user || isAnonymous(user)) {
      return;
    }

    storageRef.current?.removeItem(STORAGE_TOKEN_KEY);

    try {
      sidRef.current?.getAnalytics().logout();
    } catch {
      // fail silently
    }

    user.logout();
    setUser(undefined);
    // we need to set the oid back to the root on log out
    setOid(initialOid);
  }, [state, user, initialOid]);

  const logIn = useCallback<LogIn>(
    async (
      { factor, handle },
      { middleware } = {}
    ): Promise<User | undefined> => {
      if (state === "initial") {
        return;
      }

      const sid = sidRef.current;
      if (!sid) {
        return;
      }

      try {
        const identifier =
          factor.method === "oidc" || handle === undefined
            ? null
            : {
                type: handle.type as unknown as PersonHandleType,
                value: handle.value,
              };

        const shouldUpgradeUser = anonymousUsersEnabled && anonymousUser;

        if (shouldUpgradeUser) {
          const upgradedUser = await anonymousUser
            // @ts-expect-error TODO make the identifier optional
            .id(identifier, factor)
            .then(async (user) => {
              return applyMiddleware({ user, sid, middleware });
            });

          storeUser(upgradedUser);

          return upgradedUser;
        }

        const newUser = await sid
          // @ts-expect-error TODO make the identifier optional
          .id(oid, identifier, factor)
          .then(async (user) => {
            return applyMiddleware({ user, sid, middleware });
          });

        if (anonymousUsersEnabled && shouldUpgradeUser) {
          clearAnonymousUser();
        }

        storeUser(newUser);

        return newUser;
      } catch (e) {
        logOut();
        throw e;
      }
    },
    [
      state,
      anonymousUsersEnabled,
      anonymousUser,
      oid,
      storeUser,
      clearAnonymousUser,
      logOut,
    ]
  );

  const mfa = useCallback<MFA>(
    async ({ handle, factor }) => {
      if (anonymousUsersEnabled && anonymousUser) {
        console.warn(
          "Anonymous users cannot perform MFA, please log in first."
        );
        return;
      }

      if (state === "initial" || !user) {
        return;
      }

      await user.mfa(handle, factor);
      const userAfterMfa = new User(user.toString(), sidRef.current!);
      storeUser(userAfterMfa);
      return userAfterMfa;
    },
    [anonymousUsersEnabled, anonymousUser, state, user, storeUser]
  );

  /**
   * Recover a user account based on a handle and a given recoverable factor.
   */
  const recover = useCallback<Recover>(
    async ({ factor, handle }) => {
      if (state !== "ready" || !sidRef.current) return;

      return sidRef.current?.recover({ factor, handle });
    },
    [state]
  );

  const validateToken = useCallback(
    async (token: string): Promise<boolean> => {
      const tokenUser = new User(token, sidRef.current!);

      if (tokenUser?.anonymous && !anonymousUsersEnabled) {
        return false;
      }

      try {
        const ret = await tokenUser.validateToken();
        return ret.valid;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [anonymousUsersEnabled]
  );

  useEffect(() => {
    if (state === "initial") {
      const slashId = new SlashID({
        oid,
        ...(environment && { environment }),
        ...(baseApiUrl && { baseURL: baseApiUrl }),
        ...(sdkUrl && { sdkURL: sdkUrl }),
        ...(analyticsEnabled && { analyticsEnabled }),
      });
      const storage = createStorage(tokenStorage);

      storageRef.current = storage;
      sidRef.current = slashId;

      setState("loaded");
    }
  }, [
    oid,
    baseApiUrl,
    sdkUrl,
    state,
    tokenStorage,
    analyticsEnabled,
    environment,
  ]);

  const createAndStoreUserFromToken = useCallback(
    (token: string): User | AnonymousUser | null => {
      const sid = sidRef.current!;
      const newUser = new User(token, sid);

      if (newUser.anonymous && !anonymousUsersEnabled) {
        return null;
      }

      if (newUser.anonymous) {
        const anonUser = new AnonymousUser(token, sid);

        storeAnonymousUser(anonUser);
        return anonUser;
      }

      storeUser(newUser);
      return newUser;
    },
    [anonymousUsersEnabled, storeAnonymousUser, storeUser]
  );

  useEffect(() => {
    if (state !== "loaded") {
      return;
    }

    const sid = sidRef.current!;
    const storage = storageRef.current!;

    const loginWithInitialToken = async () => {
      const isTokenValid = token && (await validateToken(token));
      if (!isTokenValid) return null;

      return createAndStoreUserFromToken(token);
    };

    const loginWithDirectID = async () => {
      try {
        const userFromURL = await sid.getUserFromURL();
        if (!userFromURL) return null;

        const { token: tokenFromURL } = userFromURL;

        return createAndStoreUserFromToken(tokenFromURL);
      } catch (e) {
        console.error(e);
        return null;
      }
    };

    const loginWithTokenFromStorage = async () => {
      const tokenFromStorage = storage.getItem(STORAGE_TOKEN_KEY);

      const isValidToken =
        tokenFromStorage && (await validateToken(tokenFromStorage));

      if (!isValidToken) {
        storage.removeItem(STORAGE_TOKEN_KEY);

        return null;
      }

      return createAndStoreUserFromToken(tokenFromStorage);
    };

    const createAnonymousUser = async () => {
      if (!anonymousUsersEnabled) return null;

      const anonUser = await sid.createAnonymousUser();

      storeAnonymousUser(anonUser);

      return anonUser;
    };

    setState("retrievingToken");

    sequence(
      [
        loginWithInitialToken,
        loginWithDirectID,
        loginWithTokenFromStorage,
        createAnonymousUser,
      ],
      {
        until: (value) => value !== null,
        then: () => {
          setState("ready");
        },
      }
    );
  }, [
    anonymousUsersEnabled,
    createAndStoreUserFromToken,
    state,
    storeAnonymousUser,
    storeUser,
    token,
    validateToken,
  ]);

  const contextValue = useMemo(() => {
    if (state === "initial") {
      return {
        sid: undefined,
        user,
        anonymousUser,
        sdkState: state,
        logOut,
        logIn,
        mfa,
        recover,
        validateToken,
        __switchOrganizationInContext,
      };
    }

    return {
      sid: sidRef.current!,
      user,
      anonymousUser,
      sdkState: state,
      logOut,
      logIn,
      mfa,
      recover,
      validateToken,
      __switchOrganizationInContext,
    };
  }, [
    state,
    user,
    anonymousUser,
    logOut,
    logIn,
    mfa,
    recover,
    validateToken,
    __switchOrganizationInContext,
  ]);

  return (
    <SlashIDContext.Provider value={contextValue}>
      <ThemeRoot {...themeProps}>{children}</ThemeRoot>
    </SlashIDContext.Provider>
  );
};
