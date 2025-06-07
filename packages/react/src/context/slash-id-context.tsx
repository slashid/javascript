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
  SlashIDOptions,
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
import {
  createEventBuffer,
  EventBuffer,
} from "../components/form/event-buffer";
import {
  clearOrgSwitchingFlag,
  getStorageKeyForOrgSwitchingUser,
  LEGACY_STORAGE_TOKEN_KEY,
  raiseOrgSwitchingFlag,
  shouldResumeOrgSwitchingFlow,
  STORAGE_TOKEN_KEY,
} from "../domain/org";

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
  /**
   * On init SlashID SDK will attempt to resolve supported query params to a user token.
   * If this fails, the SDK will ignore the error and resume work without the initial user token.
   * You can optionally register a callback to be able to react to this error.
   */
  onInitError?: (e: Error) => void;
  themeProps?: ThemeProps;
  children: ReactNode;
}

/**
 * Used to sync the React SDK internal state to external orgID/token.
 */
type ExternalStateParams = Pick<SlashIDProviderProps, "oid" | "initialToken">;

export type Subscribe = SlashID["subscribe"];
export type Unsubscribe = SlashID["unsubscribe"];

type OrgSwitchingState =
  | {
      state: "idle";
    }
  | {
      state: "switching";
      oid: string;
    };

export interface ISlashIDContext {
  sid: SlashID | undefined;
  user: User | undefined;
  anonymousUser: AnonymousUser | undefined;
  sdkState: SDKState;
  logOut: () => undefined;
  logIn: LogIn;
  subscribe: Subscribe;
  unsubscribe: Unsubscribe;
  mfa: MFA;
  recover: Recover;
  validateToken: (token: string) => Promise<boolean>;
  __switchOrganizationInContext: ({
    oid,
  }: {
    oid: string;
  }) => Promise<User | undefined>;
  __syncExternalState: (state: ExternalStateParams) => Promise<void>;
  __orgSwitchingState: OrgSwitchingState;
}

export const initialContextValue: ISlashIDContext = {
  sid: undefined,
  user: undefined,
  anonymousUser: undefined,
  sdkState: "initial" as const,
  logOut: () => undefined,
  logIn: () => Promise.reject("NYI"),
  mfa: () => Promise.reject("NYI"),
  recover: () => Promise.reject("NYI"),
  subscribe: () => undefined,
  unsubscribe: () => undefined,
  validateToken: async () => false,
  __switchOrganizationInContext: async () => undefined,
  __syncExternalState: async () => undefined,
  __orgSwitchingState: { state: "idle" },
};

export const SlashIDContext =
  createContext<ISlashIDContext>(initialContextValue);
SlashIDContext.displayName = "SlashIDContext";

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
  children,
  ...props
}: SlashIDProviderProps) => {
  const createSlashID = useCallback((options: SlashIDOptions) => {
    return new SlashID(options);
  }, []);

  return (
    <SlashIDProviderImplementation {...props} createSlashID={createSlashID}>
      {children}
    </SlashIDProviderImplementation>
  );
};

type SlashIDProviderImplementationProps = SlashIDProviderProps & {
  createSlashID: (options: SlashIDOptions) => SlashID;
};

export function SlashIDProviderImplementation({
  oid: initialOid,
  initialToken,
  tokenStorage = "memory",
  environment,
  baseApiUrl,
  sdkUrl,
  analyticsEnabled,
  anonymousUsersEnabled = false,
  onInitError,
  themeProps,
  createSlashID,
  children,
}: SlashIDProviderImplementationProps) {
  const [oid, setOid] = useState(initialOid);
  const [token, setToken] = useState(initialToken);
  const [state, setState] = useState<SDKState>(initialContextValue.sdkState);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [anonymousUser, setAnonymousUser] = useState<AnonymousUser | undefined>(
    undefined
  );
  const storageRef = useRef<Storage | undefined>(undefined);
  const sidRef = useRef<SlashID | undefined>(undefined);
  const eventBufferRef = useRef<EventBuffer | undefined>();
  const [orgSwitchingState, setOrgSwitchingState] = useState<OrgSwitchingState>(
    {
      state: "idle",
    }
  );

  const currentOrgStorageTokenKey = useMemo(
    () => STORAGE_TOKEN_KEY(oid),
    [oid]
  );
  /**
   * Restarts the React SDK lifecycle with a new
   * configuration, potentially for a different organization.
   */
  const __syncExternalState = useCallback(
    async ({ oid: newOid, initialToken: newToken }: ExternalStateParams) => {
      setToken(newToken);
      setOid(newOid);
      setState("initial");
    },
    []
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

  const storeUser = useCallback(
    (newUser: User) => {
      if (state === "initial") {
        return;
      }

      setUser(newUser);

      storageRef.current?.setItem(
        getStorageKeyForOrgSwitchingUser(newUser) || currentOrgStorageTokenKey,
        newUser.token
      );
    },
    [state, currentOrgStorageTokenKey]
  );

  /**
   * Restarts the React SDK lifecycle with a new
   * organizational context
   */
  const __switchOrganizationInContext = useCallback(
    async ({ oid: newOid }: { oid: string }) => {
      if (!user) return;

      setOrgSwitchingState({
        state: "switching",
        oid,
      });

      let newToken: string;

      // check if a valid token for new org is in storage
      const newOidToken = storageRef.current?.getItem(
        STORAGE_TOKEN_KEY(newOid)
      );
      const isNewOidTokenValid =
        newOidToken && (await validateToken(newOidToken));
      if (isNewOidTokenValid) {
        newToken = newOidToken;
      } else {
        raiseOrgSwitchingFlag();
        newToken = await user.getTokenForOrganization(newOid);
      }

      const newUser = new User(newToken, sidRef.current);
      storageRef.current?.setItem(STORAGE_TOKEN_KEY(newOid), newToken);

      setUser(newUser);
      setToken(newToken);
      setOid(newOid);
      setOrgSwitchingState({ state: "idle" });
      clearOrgSwitchingFlag();

      return new User(newToken, sidRef.current);
    },
    [oid, user, validateToken]
  );

  const storeAnonymousUser = useCallback(
    (anonUser: AnonymousUser) => {
      if (!anonymousUsersEnabled || state === "initial") {
        return;
      }

      setAnonymousUser(anonUser);
      storageRef.current?.setItem(currentOrgStorageTokenKey, anonUser.token);

      if (analyticsEnabled) {
        try {
          // core SDK does not track anon users automatically
          sidRef.current?.getAnalytics().identify(anonUser);
        } catch {
          // fail silently
        }
      }
    },
    [currentOrgStorageTokenKey, analyticsEnabled, anonymousUsersEnabled, state]
  );

  const clearAnonymousUser = useCallback(() => {
    if (!anonymousUsersEnabled || state === "initial") {
      return;
    }

    storageRef.current?.removeItem(currentOrgStorageTokenKey);

    setAnonymousUser(undefined);
  }, [currentOrgStorageTokenKey, anonymousUsersEnabled, state]);

  const logOut = useCallback((): undefined => {
    if (state === "initial") {
      return;
    }

    if (!user || isAnonymous(user)) {
      return;
    }

    // search storage for user tokens
    Object.entries(storageRef.current!).forEach(([key, maybeToken]) => {
      // check if the storage entry is a user token
      if (key.startsWith(LEGACY_STORAGE_TOKEN_KEY)) {
        // remove the entry
        storageRef.current?.removeItem(key);
        // revoke removed token
        const tempUser = new User(maybeToken, sidRef.current);
        tempUser.logout();
      }
    });

    if (analyticsEnabled) {
      try {
        sidRef.current?.getAnalytics().logout();
      } catch {
        // fail silently
      }
    }

    setUser(undefined);
    // we need to set the oid back to the root on log out
    setOid(initialOid);
  }, [state, user, analyticsEnabled, initialOid]);

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

  const subscribe = useCallback<Subscribe>(
    (event, handler) => {
      if (state === "initial") {
        return;
      }

      const sid = sidRef.current;
      if (!sid) {
        return;
      }

      if (!eventBufferRef.current) {
        eventBufferRef.current = createEventBuffer({ sdk: sid });
      }

      // @ts-expect-error no idea why it complains
      eventBufferRef.current.subscribe(event, handler);
    },
    [state]
  );

  const unsubscribe = useCallback<Unsubscribe>(
    (event, handler) => {
      if (state === "initial") {
        return;
      }

      const sid = sidRef.current;
      if (!sid) {
        return;
      }

      if (!eventBufferRef.current) {
        return;
      }

      // @ts-expect-error no idea why it complains
      eventBufferRef.current.unsubscribe(event, handler);
    },
    [state]
  );

  useEffect(() => {
    if (state === "initial") {
      const slashId = createSlashID({
        oid,
        ...(environment && { environment }),
        ...(baseApiUrl && { baseURL: baseApiUrl }),
        ...(sdkUrl && { sdkURL: sdkUrl }),
        ...(typeof analyticsEnabled === "boolean" && { analyticsEnabled }),
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
    createSlashID,
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

  /**
   * In most cases user identification happens in `@slashid/slashid`
   * during authentication, the exception are when users are
   * "re-authenticated" using a stored token.
   *
   * In `@slashid/react` this happens in one of two scenarios:
   * - Token is provided as `initialToken` prop
   * - Token is discovered in storage i.e. `storage.getItem(STORAGE_TOKEN_KEY)`
   */
  const identifyUser = useCallback(
    (user: User | AnonymousUser | null) => {
      if (user && analyticsEnabled) {
        try {
          // in all other cases the core SDK will handle this
          // here we just recreate the user object based on the preexisting token
          // no event is emitted on the SDK side because of that
          sidRef.current?.getAnalytics().identify(user);
        } catch {
          // fail silently
        }
      }
    },
    [analyticsEnabled]
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

      const user = createAndStoreUserFromToken(token);

      identifyUser(user);

      return user;
    };

    const loginWithDirectID = async () => {
      try {
        const userFromURL = await sid.getUserFromURL();
        if (!userFromURL) return null;

        const { token: tokenFromURL } = userFromURL;

        return createAndStoreUserFromToken(tokenFromURL);
      } catch (e) {
        if (typeof onInitError === "function" && e instanceof Error) {
          onInitError(e);
        } else {
          console.error(e);
        }

        return null;
      }
    };

    const loginWithTokenFromStorage = async () => {
      const tokenFromStorage = storage.getItem(currentOrgStorageTokenKey);

      const isValidToken =
        tokenFromStorage && (await validateToken(tokenFromStorage));

      if (!isValidToken) {
        storage.removeItem(currentOrgStorageTokenKey);

        return null;
      }

      const user = createAndStoreUserFromToken(tokenFromStorage);

      identifyUser(user);

      return user;
    };

    const loginWithTokenFromStorageLegacyKey = async () => {
      const tokenFromStorage = storage.getItem(LEGACY_STORAGE_TOKEN_KEY);
      if (!tokenFromStorage) {
        return null;
      }

      // always clean up the storage if the token is present
      storage.removeItem(LEGACY_STORAGE_TOKEN_KEY);
      const isValidToken = await validateToken(tokenFromStorage);
      if (!isValidToken) {
        return null;
      }

      return createAndStoreUserFromToken(tokenFromStorage);
    };

    const createAnonymousUser = async () => {
      if (!anonymousUsersEnabled) return null;

      try {
        const anonUser = await sid.createAnonymousUser();
        storeAnonymousUser(anonUser);
        return anonUser;
      } catch (e) {
        if (typeof onInitError === "function" && e instanceof Error) {
          onInitError(e);
        } else {
          console.error(e);
        }
      }
    };

    setState("retrievingToken");

    sequence(
      [
        loginWithInitialToken,
        loginWithDirectID,
        loginWithTokenFromStorageLegacyKey,
        loginWithTokenFromStorage,
        createAnonymousUser,
      ],
      {
        until: (value) => value !== null,
        then: (foundUser) => {
          if (foundUser && shouldResumeOrgSwitchingFlow(oid, foundUser)) {
            __switchOrganizationInContext({ oid: foundUser.oid });
          }

          setState("ready");
        },
      }
    );
  }, [
    currentOrgStorageTokenKey,
    analyticsEnabled,
    anonymousUsersEnabled,
    createAndStoreUserFromToken,
    state,
    storeAnonymousUser,
    storeUser,
    token,
    validateToken,
    oid,
    __switchOrganizationInContext,
    onInitError,
  ]);

  const contextValue = useMemo<ISlashIDContext>(() => {
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
        subscribe,
        unsubscribe,
        __switchOrganizationInContext,
        __syncExternalState,
        __orgSwitchingState: orgSwitchingState,
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
      subscribe,
      unsubscribe,
      validateToken,
      __switchOrganizationInContext,
      __syncExternalState,
      __orgSwitchingState: orgSwitchingState,
    };
  }, [
    state,
    user,
    anonymousUser,
    logOut,
    logIn,
    mfa,
    recover,
    subscribe,
    unsubscribe,
    validateToken,
    __switchOrganizationInContext,
    __syncExternalState,
    orgSwitchingState,
  ]);

  return (
    <SlashIDContext.Provider value={contextValue}>
      <ThemeRoot {...themeProps}>{children}</ThemeRoot>
    </SlashIDContext.Provider>
  );
}
