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
  themeProps?: ThemeProps;
  children: ReactNode;
}

export interface ISlashIDContext {
  sid: SlashID | undefined;
  user: User | undefined;
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
  themeProps,
  children,
}: SlashIDProviderProps) => {
  const [oid, setOid] = useState(initialOid);
  const [token, setToken] = useState(initialToken);
  const [state, setState] = useState<SDKState>(initialContextValue.sdkState);
  const [user, setUser] = useState<User | undefined>(undefined);
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

  const logOut = useCallback((): undefined => {
    if (state === "initial") {
      return;
    }

    storageRef.current?.removeItem(STORAGE_TOKEN_KEY);
    if (!user) {
      return;
    }

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

        const user = await sid
          // @ts-expect-error TODO make the identifier optional
          .id(oid, identifier, factor)
          .then(async (user) => {
            return applyMiddleware({ user, sid, middleware });
          });

        storeUser(user);
        return user;
      } catch (e) {
        logOut();
        throw e;
      }
    },
    [oid, state, storeUser, logOut]
  );

  const mfa = useCallback<MFA>(
    async ({ handle, factor }) => {
      if (state === "initial" || !user) {
        return;
      }

      await user.mfa(handle, factor);
      const userAfterMfa = new User(user.toString(), sidRef.current!);
      storeUser(userAfterMfa);
      return userAfterMfa;
    },
    [state, user, storeUser]
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

  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    const tokenUser = new User(token, sidRef.current!);
    try {
      const ret = await tokenUser.validateToken();
      return ret.valid;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

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

  useEffect(() => {
    if (state !== "loaded") {
      return;
    }

    const sid = sidRef.current!;
    const storage = storageRef.current!;

    const loginDirectIdIfPresent = async () => {
      try {
        const tempUser = await sid.getUserFromURL();
        if (tempUser) {
          storeUser(new User(tempUser.token, sidRef.current!));
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.error(e);
        return false;
      }
    };

    const loginStoredToken = async (): Promise<boolean> => {
      const storedToken = storage.getItem(STORAGE_TOKEN_KEY);
      if (storedToken) {
        const isValidToken = await validateToken(storedToken);
        if (!isValidToken) {
          storage.removeItem(STORAGE_TOKEN_KEY);
          return false;
        }

        storeUser(new User(storedToken, sidRef.current!));
        return true;
      } else {
        return false;
      }
    };

    const tryImmediateLogin = async () => {
      if (token) {
        storeUser(new User(token, sidRef.current!));
      } else {
        const isDone = await loginDirectIdIfPresent();

        if (!isDone) {
          await loginStoredToken();
        }
      }

      setState("ready");
    };

    setState("retrievingToken");

    tryImmediateLogin();
  }, [state, token, storeUser, validateToken]);

  const contextValue = useMemo(() => {
    if (state === "initial") {
      return {
        sid: undefined,
        user,
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
