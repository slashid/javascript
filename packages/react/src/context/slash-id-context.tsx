import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { PersonHandleType, Factor, SlashID, User } from "@slashid/slashid";
import { MemoryStorage } from "../browser/memory-storage";

interface Handle {
  type: PersonHandleType;
  value: string;
}

export interface LoginOptions {
  handle: Handle;
  factor: Factor;
}

export type StorageOption = "memory" | "localStorage";

export interface SlashIDProviderProps {
  oid: string;
  tokenStorage?: StorageOption;
  children: React.ReactNode;
}

export interface ISlashIDContext {
  sid: SlashID | undefined;
  user: User | undefined;
  logOut: () => undefined;
  logIn: (l: LoginOptions) => Promise<User | undefined>;
  validateToken: (token: string) => Promise<boolean>;
}

const initialContextValue = {
  sid: undefined,
  user: undefined,
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

type SDKState = "initial" | "loaded" | "retrievingToken" | "ready";

export const SlashIDProvider: React.FC<SlashIDProviderProps> = ({
  oid,
  tokenStorage = "memory",
  children,
}) => {
  const [state, setState] = useState<SDKState>("initial");
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
      if (sid) {
        const user = await sid.id(oid, handle, factor);

        storeUser(user);
        storageRef.current?.setItem(STORAGE_IDENTIFIER_KEY, handle.value);

        return user;
      } else {
        return;
      }
    },
    [oid, state, storeUser]
  );

  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    const tokenUser = new User(token);
    const ret = await tokenUser.validateToken();
    return ret.valid;
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
      return { sid: undefined, user, logOut, logIn, validateToken };
    }

    return { sid: sidRef.current!, user, logOut, logIn, validateToken };
  }, [logIn, logOut, user, validateToken, state]);

  return (
    <SlashIDContext.Provider value={contextValue}>
      {children}
    </SlashIDContext.Provider>
  );
};
