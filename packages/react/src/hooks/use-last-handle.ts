import { useEffect, useMemo, useCallback } from "react";
import { isBrowser } from "@slashid/react-primitives";
import { Handle, isHandle } from "../domain/types";
import { useConfiguration } from "./use-configuration";
import { useSlashID } from "./use-slash-id";

export const STORAGE_LAST_HANDLE_KEY = "@slashid/LAST_HANDLE";

type UseLastHandle = () => {
  lastHandle: Handle | undefined;
};

type SuccessEvent = {
  handle: Handle | undefined;
};

export const useLastHandle: UseLastHandle = () => {
  const { storeLastHandle } = useConfiguration();
  const { sid } = useSlashID();

  const lastHandle = useMemo(() => {
    if (!isBrowser()) {
      return undefined;
    }

    try {
      const storedHandle = window.localStorage.getItem(STORAGE_LAST_HANDLE_KEY);
      if (!storeLastHandle || !storedHandle) {
        return undefined;
      }

      return JSON.parse(storedHandle);
    } catch {
      return undefined;
    }
  }, [storeLastHandle]);

  const handler = useCallback(({ handle }: SuccessEvent) => {
    if (!isBrowser()) {
      return;
    }

    if (!isHandle(handle)) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_LAST_HANDLE_KEY,
        JSON.stringify(handle)
      );
    } catch {
      // do nothing
    }
  }, []);

  useEffect(() => {
    if (storeLastHandle && sid) {
      // @ts-expect-error
      sid.subscribe("idFlowSucceeded", handler);
    }

    return () => {
      if (storeLastHandle && sid) {
        // @ts-expect-error
        sid.unsubscribe("idFlowSucceeded", handler);
      }
    };
  }, [storeLastHandle, sid, handler]);

  return { lastHandle };
};
