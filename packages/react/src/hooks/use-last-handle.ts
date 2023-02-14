import { useEffect, useState } from "react";
import { useConfiguration } from "./use-configuration";
import { Handle } from "../domain/types";

const STORAGE_LAST_HANDLE_KEY = "@slashid/LAST_HANDLE";

type UseLastHandle = () => {
  lastHandle: Handle | undefined;
};

export const useLastHandle: UseLastHandle = () => {
  const { storeLastHandle } = useConfiguration();
  const [lastHandle, setLastHandle] = useState<Handle | undefined>(undefined);

  useEffect(() => {
    if (storeLastHandle) {
      const storedHandle = window.localStorage.getItem(STORAGE_LAST_HANDLE_KEY);
      if (storeLastHandle) {
        setLastHandle(JSON.parse(storedHandle!));
      }
    }
  }, [storeLastHandle]);

  useEffect(() => {
    if (!storeLastHandle) {
      return;
    }

    const listener = (msg: unknown) => {
      console.log(msg);
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [storeLastHandle]);

  return { lastHandle };
};
