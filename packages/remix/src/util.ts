import {
  LoaderFunctionArgs,
  json,
  type defer,
} from "@remix-run/server-runtime";
import { RootAuthLoaderCallbackReturn } from "./callback";
import { SSR } from "@slashid/slashid";

export type LoaderFunctionWithSlashIDProps = LoaderFunctionArgs & {
  request: LoaderFunctionArgs["request"] & { slashid?: string };
};

export const addSlashIdToRequest = (args: LoaderFunctionArgs, slashid: { slashid?: string }) => {
  Object.assign(args.request, slashid)

  return args as LoaderFunctionWithSlashIDProps
};

export const addSlashIdToResponse = async (
  response: Response,
  slashid: any
) => {
  const clone = response.clone();
  const data = (await clone.json()) ?? {};

  clone.headers.set("content-type", "application/json");

  return json({ ...(data || {}), ...slashid }, clone);
};

export const addSlashIdToDeferredResponse = async (
  response: ReturnType<typeof defer>,
  slashid: any
) => {
  response.data.slashid = slashid;

  return response;
};

export function assertCallbackResult(
  callbackReturn: any
): asserts callbackReturn is Record<string, unknown> | null {
  if (
    Array.isArray(callbackReturn) ||
    (callbackReturn !== null && typeof callbackReturn !== "object")
  ) {
    throw new Error("Bad callback return type");
  }
}

export const getUserTokenFromCookies = (
  cookies: string | null
): string | undefined => {
  if (!cookies) return undefined;

  const all = cookies
    .split(";")
    .filter((cookie) => cookie.includes("="))
    .map((cookie) => cookie.split("="))
    .reduce<Record<string, string>>((acc, cur) => {
      const [encodedKey, encodedValue] = cur;

      const key = decodeURIComponent(encodedKey.trim());
      const value = decodeURIComponent(encodedValue.trim());

      return {
        ...acc,
        [key]: value,
      };
    }, {});

  const STORAGE_KEY = "@slashid/USER_TOKEN";

  return all[STORAGE_KEY];
};

type BaseUser = typeof SSR.User;

/**
 * Use this function in a loader to check if the user is authenticated.
 * @param request
 * @returns
 */
export const getUserFromRequest = (request: Request): BaseUser | undefined => {
  const cookies = request.headers.get("cookie");
  const token = getUserTokenFromCookies(cookies);

  if (!token) return undefined;

  // TODO options are missing here - do not create a user without making sure the same options are used as for the base SDK
  // @ts-expect-error
  return new SSR.User(token);
};

export const isResponse = (
  callback: RootAuthLoaderCallbackReturn
): callback is Response => {
  console.log(callback);
  throw new Error("Not implemented");
};

export const isRedirect = (callback: RootAuthLoaderCallbackReturn): boolean => {
  console.log(callback);
  throw new Error("Not implemented");
};
