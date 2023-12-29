import { useRevalidator } from "@remix-run/react";
import { useSlashID as useSlashIDReact, type UseSlashID } from "@slashid/react";

export const useSlashID = (): UseSlashID => {
  const { logOut, ...rest } = useSlashIDReact();
  const revalidator = useRevalidator();

  return {
    logOut: () => {
      logOut();
      revalidator.revalidate();
      return undefined
    },
    ...rest,
  };
};
