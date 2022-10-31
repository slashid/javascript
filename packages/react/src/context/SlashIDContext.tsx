import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { PersonHandleType, SlashID, User } from "@slashid/slashid";

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

export interface SlashIDProviderProps {
  oid: string;
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

export const SlashIDProvider: React.FC<SlashIDProviderProps> = ({
  oid,
  children,
}) => {
  const [sid, setSid] = useState<SlashID | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);

  const storeUser = (newUser: User) => {
    setUser(newUser);
    window.localStorage.setItem(STORAGE_TOKEN_KEY, newUser.token);
  };

  const logOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_TOKEN_KEY);
    if (!user) {
      return;
    }

    user.logout();
    setUser(undefined);
  }, [user]);

  const logIn = useCallback(
    async ({ factor, handle }: LoginOptions) => {
      if (sid) {
        // @ts-expect-error TODO export Factor type and use it here
        const user = await sid.id(oid, handle, factor);

        storeUser(user);
        window.localStorage.setItem(STORAGE_IDENTIFIER_KEY, handle.value);

        return user;
      } else {
        return null;
      }
    },
    [oid, sid]
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
        }
      } catch (e) {
        console.log(e);
        return;
      }
    };

    const loginStoredToken = async (): Promise<boolean> => {
      const storedToken = window.localStorage.getItem(STORAGE_TOKEN_KEY);
      if (storedToken) {
        const isValidToken = await validateToken(storedToken);
        if (!isValidToken) {
          window.localStorage.removeItem(STORAGE_TOKEN_KEY);
          return false;
        }

        storeUser(new User(storedToken));
        return true;
      } else {
        return false;
      }
    };

    const tryImmediateLogin = async () => {
      const loggedInStoredUser = await loginStoredToken();
      if (!loggedInStoredUser) {
        await loginDirectIdIfPresent();
      }
    };

    tryImmediateLogin();
  }, [logOut, sid, validateToken]);

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
