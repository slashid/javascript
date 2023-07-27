import { OrganizationDetails } from "@slashid/slashid"
import { useState, useMemo, useEffect, useCallback } from "react"
import { useSlashID } from "./use-slash-id"
import { ISlashIDContext } from "../context/slash-id-context"

export const useOrganizations = () => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [organizations, setOrganizations] = useState<OrganizationDetails[]>([])

  const { user, __switchOrganizationInContext } = useSlashID()

  const switchOrganization = useCallback<ISlashIDContext['__switchOrganizationInContext']>(({ oid }) => {
    __switchOrganizationInContext({ oid })
  }, [])

  const currentOrganization = useMemo(() => {
    if (!user) return null

    return organizations.find(org => org.id === user.oid) ?? null
  }, [organizations, user, user?.oid])

  useEffect(() => {
    if (!user) return
    if (organizations.length) return

    user.getOrganizations()
      .then(({ organizations }) => {
        setOrganizations(organizations)
        setLoading(false)
      })
  }, [user])

  return {
    isLoading,
    organizations,
    currentOrganization,
    switchOrganization
  }
}