import { useAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import { organizations as organizationsAtom, currentOrganization as currentOrganizationAtom } from '../stores/orgs'
import { useSlashID } from './use-slash-id'
import { useMemo } from 'react'

export const useOrganizationsA = () => {
  const { user } = useSlashID()
  const [orgs] = useAtom(loadable(organizationsAtom))

  const isLoading = orgs.state !== 'hasData'
  const currentOrganization = useMemo(() => {
    if (isLoading || !user) return null

    return orgs.data.find(org => org.id === user.oid) ?? null
  }, [isLoading, user, orgs])

  return {
    organizations: !isLoading
      ? orgs.data
      : [],
    isLoading: orgs.state !== 'hasData',
    currentOrganization
  }
}

export const useOrganizationsB = () => {
  const [orgs] = useAtom(organizationsAtom)
  const [currentOrganization] = useAtom(currentOrganizationAtom)

  return {
    organizations: orgs,
    currentOrganization
  }
}