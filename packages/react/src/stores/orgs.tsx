import { atom } from 'jotai'
import { user as userAtom } from './user'

export const organizations = atom(async (get) => {
  const user = get(userAtom)
  if (!user) return Promise.resolve(null)
  return user.getOrganizations()
})
