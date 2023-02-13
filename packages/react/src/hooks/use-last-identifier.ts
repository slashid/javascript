import { useCallback, useMemo } from "react";
import { HandleType } from "../domain/types";

const LAST_IDENTIFIER_HANDLE_TYPE_KEY =
  "slash-id__last-identifier__handle-type";
const LAST_IDENTIFIER_VALUE_KEY = "slash-id__last-identifier__value";

type LastIdentifier = {
  handleType?: HandleType;
  value?: string;
};

type UseLastIdentifier = {
  lastIdentifier: LastIdentifier;
  storeLastIdentifier: (id: LastIdentifier) => void;
};

export const useLastIdentifier = (): UseLastIdentifier => {
  const handleType = useMemo<HandleType | undefined>(() => {
    const storedHandleType = localStorage.getItem(
      LAST_IDENTIFIER_HANDLE_TYPE_KEY
    );
    return storedHandleType ? JSON.parse(storedHandleType) : undefined;
  }, []);

  const value = useMemo<string | undefined>(() => {
    const storedValue = localStorage.getItem(LAST_IDENTIFIER_VALUE_KEY);
    return storedValue ? JSON.parse(storedValue) : undefined;
  }, []);

  const storeLastIdentifier = useCallback((identifier: LastIdentifier) => {
    localStorage.setItem(
      LAST_IDENTIFIER_HANDLE_TYPE_KEY,
      JSON.stringify(identifier.handleType)
    );
    localStorage.setItem(
      LAST_IDENTIFIER_VALUE_KEY,
      JSON.stringify(identifier.value)
    );
  }, []);

  return {
    lastIdentifier: {
      handleType,
      value,
    },
    storeLastIdentifier,
  };
};
