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

interface Handle {
  type: PersonHandleType;
  value: string;
}

// TODO export this from the base package
interface Factor {
  method: string;
  options?: { [key: string]: string | number | boolean };
}
export interface LoginOptions {
  handle: Handle;
  factor: Factor;
}

export type StorageOption = "memory" | "localStorage";

export type DirectIdOption = boolean;
export interface SlashIDProviderProps {
  oid: string;
  storage?: StorageOption;
  directId?: DirectIdOption;
  children: React.ReactNode;
}

export interface ISlashIDContext {
  sid: SlashID | undefined;
  user: User | undefined;
  logOut: () => void;
  logIn: (l: LoginOptions) => Promise<User | null>;
  validateToken: (token: string) => Promise<boolean>;
}

export const SlashIDContext = createContext<ISlashIDContext>({
  sid: undefined,
  user: undefined,
  logOut: () => undefined,
  logIn: () => Promise.reject("NYI"),
  validateToken: () => Promise.resolve(false),
});
SlashIDContext.displayName = "SlashIDContext";

const STORAGE_IDENTIFIER_KEY = "@slashid/IDENTIFIERS";
const STORAGE_TOKEN_KEY = "@slashid/USER_TOKEN";

const createStorageFactory = () => {
  const memoryStorage = new MemoryStorage();

  return function getStorage(storageType: StorageOption) {
    switch (storageType) {
      case "memory":
        return memoryStorage;
      case "localStorage":
        return window.localStorage;
      default:
        return memoryStorage;
    }
  };
};

export const SlashIDProvider: React.FC<SlashIDProviderProps> = ({
  oid,
  storage = "memory",
  directId = false,
  children,
}) => {
  const [sid, setSid] = useState<SlashID | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const { current: getStorage } = useRef(createStorageFactory());

  const storeUser = useCallback(
    (newUser: User) => {
      setUser(newUser);
      getStorage(storage).setItem(STORAGE_TOKEN_KEY, newUser.token);
    },
    [getStorage, storage]
  );

  const logOut = useCallback(() => {
    getStorage(storage).removeItem(STORAGE_TOKEN_KEY);
    if (!user) {
      return;
    }

    user.logout();
    setUser(undefined);
  }, [getStorage, storage, user]);

  const logIn = useCallback(
    async ({ factor, handle }: LoginOptions) => {
      if (sid) {
        // @ts-expect-error TODO export Factor type and use it here
        const user = await sid.id(oid, handle, factor);

        storeUser(user);
        getStorage(storage).setItem(STORAGE_IDENTIFIER_KEY, handle.value);

        return user;
      } else {
        return null;
      }
    },
    [getStorage, oid, sid, storage, storeUser]
  );

  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    const tokenUser = new User(token);
    const ret = await tokenUser.validateToken();
    return ret.valid;
  }, []);

  useEffect(() => {
    const slashId = new SlashID();
    setSid(slashId);
  }, []);

  useEffect(() => {
    if (!sid) {
      return;
    }

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
        console.log(e);
        return false;
      }
    };

    const loginStoredToken = async (): Promise<boolean> => {
      const storedToken = getStorage(storage).getItem(STORAGE_TOKEN_KEY);
      if (storedToken) {
        const isValidToken = await validateToken(storedToken);
        if (!isValidToken) {
          getStorage(storage).removeItem(STORAGE_TOKEN_KEY);
          return false;
        }

        storeUser(new User(storedToken));
        return true;
      } else {
        return false;
      }
    };

    const tryImmediateLogin = async () => {
      let isDone = false;
      if (directId) {
        isDone = await loginDirectIdIfPresent();
      }

      if (!isDone) {
        await loginStoredToken();
      }
    };

    tryImmediateLogin();
  }, [directId, getStorage, logOut, sid, storage, storeUser, validateToken]);

  const contextValue = useMemo(
    () => ({ sid, user, logOut, logIn, validateToken }),
    [sid, user, logOut, logIn, validateToken]
  );

  return (
    <SlashIDContext.Provider value={contextValue}>
      {children}
    </SlashIDContext.Provider>
  );
};
