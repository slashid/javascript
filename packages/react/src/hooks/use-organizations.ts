import React, { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import { useSlashID } from "./use-slash-id";
import { ISlashIDContext } from "../context/slash-id-context";
import { OrganizationDetails } from "@slashid/slashid";

export interface UseOrganizations {
  organizations: OrganizationDetails[]
  currentOrganization: OrganizationDetails | null
  switchOrganization: ({ oid }: { oid: string }) => void
  isLoading: boolean
}

export const useOrganizations = (): UseOrganizations => {
  const { user, __switchOrganizationInContext } = useSlashID();
  const [organizations, setOrganizations] = useState<OrganizationDetails[]>([])

  useEffect(() => {
    if (!user) return

    setOrganizations([])
    
    user.getOrganizations()
      .then(organizations => {
        setOrganizations(organizations)
      })
  }, [user])

  const currentOrganization = useMemo(() => {
    if (!user) return null

    return organizations.find(org => org.id === user.oid) ?? null
  }, [organizations, user])

  const isLoading = useMemo(() => Boolean(!organizations.length) || !currentOrganization, [organizations, currentOrganization])

  const switchOrganization = useCallback<
    ISlashIDContext["__switchOrganizationInContext"]
  >(
    ({ oid }) => __switchOrganizationInContext({ oid }),
    [__switchOrganizationInContext]
  );

  return {
    organizations,
    currentOrganization,
    switchOrganization,
    isLoading
  };
};
