/* eslint-disable react/display-name */
import { useLoaderData } from '@remix-run/react';
import { RemixSlashIDProviderOptions, SlashIDProvider } from "./slashid-provider"

type SlashIDAppOptions = Omit<RemixSlashIDProviderOptions, "children" | "initialToken">

export function SlashIDApp(App: () => JSX.Element, options: SlashIDAppOptions) {
  return () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const data = useLoaderData<{ slashid?: string }>()

    console.log('root loader response', data)

    const { slashid } = data
    
    return (
      <SlashIDProvider
        baseApiUrl="https://api.slashid.com"
        sdkUrl="https://cdn.sandbox.slashid.com/sdk.html"
        initialToken={slashid}
        {...options}
      >
        <App />
      </SlashIDProvider>
    )
  }
}