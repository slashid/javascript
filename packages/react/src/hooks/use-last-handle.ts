import { useEffect, useMemo, useRef, useCallback } from "react";
import { Handle } from "../domain/types";
import { useConfiguration } from "./use-configuration";
import { useSlashID } from "./use-slash-id";

const STORAGE_LAST_HANDLE_KEY = "@slashid/LAST_HANDLE";

type UseLastHandle = () => {
  lastHandle: Handle | undefined;
};

type SuccessEvent = {
  identifier: Handle | undefined;
};

export const useLastHandle: UseLastHandle = () => {
  const { storeLastHandle } = useConfiguration();
  const { sid, sdkState } = useSlashID();
  const subscribed = useRef(false);

  const lastHandle = useMemo(() => {
    const storedHandle = window.localStorage.getItem(STORAGE_LAST_HANDLE_KEY);
    if (!storeLastHandle || !storedHandle) {
      return undefined;
    }

    return JSON.parse(storedHandle);
  }, [storeLastHandle]);

  const handler = useCallback((e: SuccessEvent) => {
    window.localStorage.setItem(
      STORAGE_LAST_HANDLE_KEY,
      JSON.stringify(e.identifier)
    );
  }, []);

  useEffect(() => {
    if (!storeLastHandle || sdkState !== "loaded" || sid === undefined) {
      return;
    }

    if (!subscribed.current) {
      subscribed.current = true;
      // @ts-expect-error TODO core SDK does not export the correct event handler type
      sid.subscribe("idFlowSucceeded", handler);
    }
  }, [storeLastHandle, sid, sdkState, handler]);

  useEffect(() => {
    return () => {
      if (subscribed.current) {
        // @ts-expect-error TODO core SDK does not export the correct event handler type
        sid?.unsubscribe("idFlowSucceeded", handler);
      }
    };
  }, [handler, sid]);

  return { lastHandle };
};
