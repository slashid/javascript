import { LoaderFunctionArgs } from "@remix-run/server-runtime";

type ObjectAlike = Record<string, unknown> | null;

export type RootAuthLoaderCallbackReturn =
  | Promise<Response>
  | Response
  | Promise<ObjectAlike>
  | ObjectAlike;

export type RootAuthLoaderCallback = (
  args: LoaderFunctionArgs
) => RootAuthLoaderCallbackReturn;

export const isCallbackDefined = (callback: any): callback is RootAuthLoaderCallback => {
  return callback !== undefined
}