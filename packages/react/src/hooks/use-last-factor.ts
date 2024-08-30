import { useEffect, useMemo, useCallback } from "react";
import { isBrowser } from "@slashid/react-primitives";
import { Handle, isFactor } from "../domain/types";
import { useConfiguration } from "./use-configuration";
import { useSlashID } from "./use-slash-id";
import { Factor } from "@slashid/slashid";

export const STORAGE_LAST_FACTOR_KEY = (oid: string) =>
  `@slashid/LAST_FACTOR/${oid}`;

type UseLastFactor = () => {
  lastFactor: Factor | undefined;
};

type SuccessEvent = {
  authenticationFactor: Handle | undefined;
};

export const useLastFactor: UseLastFactor = () => {
  const { storeLastFactor } = useConfiguration();
  const { sid } = useSlashID();

  const lastFactor = useMemo(() => {
    if (!isBrowser()) {
      return undefined;
    }

    try {
      const storedFactor = window.localStorage.getItem(
        STORAGE_LAST_FACTOR_KEY(sid?.oid ?? "")
      );
      if (!storeLastFactor || !storedFactor) {
        return undefined;
      }

      return JSON.parse(storedFactor);
    } catch {
      return undefined;
    }
  }, [storeLastFactor, sid]);

  const handler = useCallback(
    ({ authenticationFactor }: SuccessEvent) => {
      if (!isBrowser()) {
        return;
      }

      if (!isFactor(authenticationFactor)) {
        return;
      }

      try {
        window.localStorage.setItem(
          STORAGE_LAST_FACTOR_KEY(sid?.oid ?? ""),
          JSON.stringify(authenticationFactor)
        );
      } catch {
        // do nothing
      }
    },
    [sid]
  );

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
