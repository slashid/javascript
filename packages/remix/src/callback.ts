import { LoaderFunctionWithSlashIDProps } from "./util";

type ObjectAlike = Record<string, unknown> | null;

export type RootAuthLoaderCallbackReturn =
  | Promise<Response>
  | Response
  | Promise<ObjectAlike>
  | ObjectAlike;

export type RootAuthLoaderCallback = (
  args: LoaderFunctionWithSlashIDProps
) => RootAuthLoaderCallbackReturn;

export const isCallbackDefined = (callback: any): callback is RootAuthLoaderCallback => {
  return callback !== undefined
}