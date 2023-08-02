import { atom } from 'jotai'
import { user as userAtom } from './user'

export const organizations = atom(async (get) => {
  const user = get(userAtom)
  if (!user) return Promise.resolve([])
  return user.getOrganizations()
})

export const currentOrganization = atom(async (get) => {
  const user = get(userAtom)
  if (!user) return null

  const orgs = await get(organizations)

  return orgs.find(org => org.id === user.oid) ?? null
})
