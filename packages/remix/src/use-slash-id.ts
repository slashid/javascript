import { useRevalidator } from "@remix-run/react"
import { useSlashID as useSlashIDReact } from '@slashid/react'

export const useSlashID = () => {
  const { logOut, ...rest } = useSlashIDReact()
  const revalidator = useRevalidator()

  return {
    logOut: () => {
      logOut()
      revalidator.revalidate();
    },
    ...rest
  }
}