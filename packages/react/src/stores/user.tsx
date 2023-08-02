import { User } from '@slashid/slashid'
import { atom } from 'jotai'

export const user = atom<User | null>(null)