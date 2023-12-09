// import { useSlashID } from "@slashid/react"
import { LoaderFunctionArgs, json, DataFunctionArgs, type defer } from '@remix-run/server-runtime'
import { RootAuthLoaderCallbackReturn } from './callback';

export type LoaderFunctionWithSlashIDProps = DataFunctionArgs & {
  request: DataFunctionArgs["request"] & { slashid: "hello world!" };
};

export const addSlashIdToRequest = (args: LoaderFunctionArgs, slashid: any) => {
  // const { user } = useSlashID()

  Object.assign(args.request, slashid)

  return args as LoaderFunctionWithSlashIDProps
}

export const addSlashIdToResponse = async (
  response: Response,
  slashid: any
) => {
  const clone = response.clone()
  const data = await clone.json() ?? {}

  clone.headers.set("content-type", "application/json")

  return json({ ...(data || {}), ...slashid }, clone);
};

export const addSlashIdToDeferredResponse = async (
  response: ReturnType<typeof defer>,
  slashid: any
) => {
  response.data.slashid = slashid

  return response
}

export function assertCallbackResult(callbackReturn: any): asserts callbackReturn is Record<string, unknown> | null {
  if (Array.isArray(callbackReturn) || (callbackReturn !== null && typeof callbackReturn !== 'object')) {
    throw new Error("Bad callback return type")
  }  
}

export const getUserTokenFromCookies = (cookies: string | null): string | undefined => {
  if (!cookies) return undefined

  const all = cookies
    .split(';')
    .filter(cookie => cookie.includes('='))
    .map(cookie => cookie.split('='))
    .reduce<Record<string, string>>((acc, cur) => {
      const [encodedKey, encodedValue] = cur

      const key = decodeURIComponent(encodedKey.trim())
      const value = decodeURIComponent(encodedValue.trim());

      return {
        ...acc,
        [key]: value
      }
    }, {})

  const STORAGE_KEY = "@slashid/USER_TOKEN"
      
  return all[STORAGE_KEY]
}

export const isResponse = (callback: RootAuthLoaderCallbackReturn): callback is Response => {
  console.log(callback)
  throw new Error("Not implemented")
}

export const isRedirect = (callback: RootAuthLoaderCallbackReturn): boolean => {
  console.log(callback)
  throw new Error("Not implemented")
}
