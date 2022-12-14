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
import { LogIn, LoginOptions } from "../domain/types";

export type StorageOption = "memory" | "localStorage";

export interface SlashIDProviderProps {
  oid: string;
  tokenStorage?: StorageOption;
  children: React.ReactNode;
}

type SDKState =
  | "initial"
  | "loaded"
  | "retrievingToken"
  | "authenticating"
  | "ready";
export interface ISlashIDContext {
  sid: SlashID | undefined;
  user: User | undefined;
  sdkState: SDKState;
  logOut: () => undefined;
  logIn: LogIn;
  validateToken: (token: string) => Promise<boolean>;
}

export const initialContextValue = {
  sid: undefined,
  user: undefined,
  sdkState: "initial" as const,
  logOut: () => undefined,
  logIn: () => Promise.reject("NYI"),
  validateToken: () => Promise.resolve(false),
};

export const SlashIDContext =
  createContext<ISlashIDContext>(initialContextValue);
SlashIDContext.displayName = "SlashIDContext";

const STORAGE_IDENTIFIER_KEY = "@slashid/LAST_IDENTIFIER";
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
  tokenStorage = "memory",
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

      setState("authenticating");

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
        if (handle) {
          storageRef.current?.setItem(STORAGE_IDENTIFIER_KEY, handle.value);
        }
        setState("ready");
        return user;
      } catch (e) {
        setState("ready");
        logOut();
        throw e;
      }
    },
    [oid, state, storeUser, logOut]
  );

  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    const tokenUser = new User(token);
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
      const slashId = new SlashID();
      const storage = createStorage(tokenStorage);

      storageRef.current = storage;
      sidRef.current = slashId;

      setState("loaded");
    }
  }, [state, tokenStorage]);

  useEffect(() => {
    if (state !== "initial") {
      const slashId = sidRef.current!;
      // @ts-expect-error TODO expose the type
      const getUserFromEvent = ({ token }) => {
        const userFromToken = new User(token);
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
          storeUser(tempUser);
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

        storeUser(new User(storedToken));
        return true;
      } else {
        return false;
      }
    };

    const tryImmediateLogin = async () => {
      const isDone = await loginDirectIdIfPresent();

      if (!isDone) {
        await loginStoredToken();
      }

      setState("ready");
    };

    setState("retrievingToken");
    tryImmediateLogin();
  }, [state, storeUser, validateToken]);

  const contextValue = useMemo(() => {
    if (state === "initial") {
      return {
        sid: undefined,
        user,
        sdkState: state,
        logOut,
        logIn,
        validateToken,
      };
    }

    return {
      sid: sidRef.current!,
      user,
      sdkState: state,
      logOut,
      logIn,
      validateToken,
    };
  }, [logIn, logOut, user, validateToken, state]);

  return (
    <SlashIDContext.Provider value={contextValue}>
      {children}
    </SlashIDContext.Provider>
  );
};
