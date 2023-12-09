import { SlashIDProvider as ReactSlashIDProvider } from '@slashid/react'
import { SlashIDProviderProps } from '@slashid/react/dist/context/slash-id-context'

export type RemixSlashIDProviderOptions = Omit<SlashIDProviderProps, "tokenStorage">

export const SlashIDProvider = ({ children, ...props }: RemixSlashIDProviderOptions) => {
  return (
    <ReactSlashIDProvider
      {...props}
      tokenStorage="cookie"
    >
      {children}
    </ReactSlashIDProvider>
  )
}