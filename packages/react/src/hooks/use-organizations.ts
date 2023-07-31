import React from "react";
import { useCallback } from "react";
import { useSlashID } from "./use-slash-id";
import { ISlashIDContext } from "../context/slash-id-context";
import {
  IOrganizationContext,
  OrganizationContext,
} from "../context/organization-context";

interface UseOrganizations extends IOrganizationContext {
  switchOrganization: ({ oid }: { oid: string }) => void;
}

export const useOrganizations = (): UseOrganizations => {
  const { __switchOrganizationInContext } = useSlashID();
  const contextValue = React.useContext(OrganizationContext);

  const switchOrganization = useCallback<
    ISlashIDContext["__switchOrganizationInContext"]
  >(
    ({ oid }) => {
      __switchOrganizationInContext({ oid });
    },
    [__switchOrganizationInContext]
  );

  return {
    ...contextValue,
    switchOrganization,
  };
};
