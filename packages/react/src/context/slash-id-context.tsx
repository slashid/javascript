import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { PersonHandleType, SlashID, User } from "@slashid/slashid";
import { MemoryStorage } from "../browser/memory-storage";
import { LogIn, LoginOptions, MFA } from "../domain/types";
import { SDKState } from "../domain/sdk-state";

export type StorageOption = "memory" | "localStorage";

export interface SlashIDProviderProps {
  oid: string;
  initialToken?: string;
  tokenStorage?: StorageOption;
  baseApiUrl?: string;
  sdkUrl?: string;
  analyticsEnabled?: boolean;
  children: React.ReactNode;
}

export interface ISlashIDContext {
  sid: SlashID | undefined;
  user: User | undefined;
  sdkState: SDKState;
  logOut: () => undefined;
  logIn: LogIn;
  mfa: MFA;
  validateToken: (token: string) => Promise<boolean>;
}

export const initialContextValue = {
  sid: undefined,
  user: undefined,
  sdkState: "initial" as const,
  logOut: () => undefined,
  logIn: () => Promise.reject("NYI"),
  mfa: () => Promise.reject("NYI"),
  validateToken: () => Promise.resolve(false),
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
    default:
      return new MemoryStorage();
  }
};

export const SlashIDProvider: React.FC<SlashIDProviderProps> = ({
  oid,
  initialToken,
  tokenStorage = "memory",
  baseApiUrl,
  sdkUrl,
  analyticsEnabled = false,
  children,
}) => {
  const [state, setState] = useState<SDKState>(initialContextValue.sdkState);
  const [user, setUser] = useState<User | undefined>(undefined);
  const storageRef = useRef<Storage | undefined>(undefined);
  const sidRef = useRef<SlashID | undefined>(undefined);

  const storeUser = useCallback(
    (newUser: User) => {
      if (state === "initial") {
        return;
      }

      setUser(newUser);
      storageRef.current?.setItem(STORAGE_TOKEN_KEY, newUser.token);
    },
    [state]
  );

  const logOut = useCallback((): undefined => {
    if (state === "initial") {
      return;
    }

    storageRef.current?.removeItem(STORAGE_TOKEN_KEY);
    if (!user) {
      return;
    }

    user.logout();
    setUser(undefined);
  }, [user, state]);

  const logIn = useCallback(
    async ({ factor, handle }: LoginOptions): Promise<User | undefined> => {
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

        // @ts-expect-error TODO make the identifier optional
        const user = await sid.id(oid, identifier, factor);
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
      return user;
    },
    [user, state]
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
        ...(baseApiUrl && { baseURL: baseApiUrl }),
        ...(sdkUrl && { sdkURL: sdkUrl }),
        ...(analyticsEnabled && { analyticsEnabled }),
      });
      const storage = createStorage(tokenStorage);

      storageRef.current = storage;
      sidRef.current = slashId;

      setState("loaded");
    }
  }, [oid, baseApiUrl, sdkUrl, state, tokenStorage, analyticsEnabled]);

  useEffect(() => {
    if (state !== "initial") {
      const slashId = sidRef.current!;
      // @ts-expect-error TODO expose the type
      const getUserFromEvent = ({ token }) => {
        const userFromToken = new User(token, sidRef.current!);
        if (!user || userFromToken.token !== user.token) {
          setUser(userFromToken);
        }
      };
      slashId.subscribe("idFlowSucceeded", getUserFromEvent);

      return () => slashId.unsubscribe("idFlowSucceeded", getUserFromEvent);
    }
  }, [state, user]);

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
      if (initialToken) {
        storeUser(new User(initialToken, sidRef.current!));
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
  }, [state, initialToken, storeUser, validateToken]);

  const contextValue = useMemo(() => {
    if (state === "initial") {
      return {
        sid: undefined,
        user,
        sdkState: state,
        logOut,
        logIn,
        mfa,
        validateToken,
      };
    }

    return {
      sid: sidRef.current!,
      user,
      sdkState: state,
      logOut,
      logIn,
      mfa,
      validateToken,
    };
  }, [logIn, logOut, user, validateToken, state, mfa]);

  return (
    <SlashIDContext.Provider value={contextValue}>
      {children}
    </SlashIDContext.Provider>
  );
};
