import React from "react"
import { useMemo, useCallback } from "react"
import { OrganizationDetails } from "@slashid/slashid"
import { useSlashID } from "./use-slash-id"
import { ISlashIDContext } from "../context/slash-id-context"
import { IOrganizationContext, OrganizationContext } from "../context/organization-context"

interface UseOrganizations extends IOrganizationContext {
  // currentOrganization: OrganizationDetails | null
  switchOrganization: ({ oid }: { oid: string }) => void
}

export const useOrganizations = (): UseOrganizations => {
  const { __switchOrganizationInContext } = useSlashID()
  const contextValue = React.useContext(OrganizationContext);

  const switchOrganization = useCallback<ISlashIDContext['__switchOrganizationInContext']>(({ oid }) => {
    __switchOrganizationInContext({ oid })
  }, [])

  return {
    ...contextValue,
    switchOrganization
  }
}