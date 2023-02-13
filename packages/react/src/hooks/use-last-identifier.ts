import { useCallback } from "react";
import { HandleType } from "../domain/types";
import { useLocalStorage } from "./use-local-storage";

const LAST_IDENTIFIER_HANDLE_TYPE_KEY =
  "slash-id__last-identifier__handle-type";
const LAST_IDENTIFIER_VALUE_KEY = "slash-id__last-identifier__value";

type LastIdentifier = {
  handleType: HandleType;
  value: string;
};

export const useLastIdentifier = () => {
  const [handleType, setHandleType] = useLocalStorage<HandleType>(
    LAST_IDENTIFIER_HANDLE_TYPE_KEY,
    "email_address"
  );

  const [value, setValue] = useLocalStorage<string>(
    LAST_IDENTIFIER_VALUE_KEY,
    ""
  );

  const storeLastIdentifier = useCallback(
    (identifier: LastIdentifier) => {
      setHandleType(identifier.handleType);
      setValue(identifier.value);
    },
    [setHandleType, setValue]
  );

  return {
    lastIdentifier: { handleType, value },
    storeLastIdentifier,
  };
};
