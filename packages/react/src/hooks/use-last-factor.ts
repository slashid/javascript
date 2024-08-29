import { useEffect, useMemo, useCallback } from "react";
import { isBrowser } from "@slashid/react-primitives";
import { Handle, isHandle } from "../domain/types";
import { useConfiguration } from "./use-configuration";
import { useSlashID } from "./use-slash-id";
import { Factor } from "@slashid/slashid";

export const STORAGE_LAST_FACTOR_KEY = "@slashid/LAST_FACTOR";

type UseLastFactor = () => {
  lastFactor: Factor | undefined;
};

type SuccessEvent = {
  factor: Handle | undefined;
};

export const useLastFactor: UseLastFactor = () => {
  const { storeLastFactor } = useConfiguration();
  const { sid } = useSlashID();

  const lastFactor = useMemo(() => {
    if (!isBrowser()) {
      return undefined;
    }

    try {
      const storedFactor = window.localStorage.getItem(STORAGE_LAST_FACTOR_KEY);
      if (!storeLastFactor || !storedFactor) {
        return undefined;
      }

      return JSON.parse(storedFactor);
    } catch {
      return undefined;
    }
  }, [storeLastFactor]);

  const handler = useCallback(({ factor }: SuccessEvent) => {
    if (!isBrowser()) {
      return;
    }

    if (!isHandle(factor)) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_LAST_FACTOR_KEY,
        JSON.stringify(factor)
      );
    } catch {
      // do nothing
    }
  }, []);

  useEffect(() => {
    if (storeLastFactor && sid) {
      // @ts-expect-error
      sid.subscribe("idFlowSucceeded", handler);
    }

    return () => {
      if (storeLastFactor && sid) {
        // @ts-expect-error
        sid.unsubscribe("idFlowSucceeded", handler);
      }
    };
  }, [storeLastFactor, sid, handler]);

  return { lastFactor };
};
