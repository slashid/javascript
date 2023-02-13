import { useState, useEffect, Dispatch, SetStateAction } from "react";

export const useLocalStorage = <T>(
  storageKey: string,
  fallbackState: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(
    JSON.parse(localStorage.getItem(storageKey) ?? "") ?? fallbackState
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};
