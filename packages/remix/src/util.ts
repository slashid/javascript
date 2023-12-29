import {
  LoaderFunctionArgs,
  json,
  type defer,
} from "@remix-run/server-runtime";
import { RootAuthLoaderCallbackReturn } from "./callback";
import { SSR } from "@slashid/slashid";

export const addSlashIdToResponse = async <T extends (...args: any) => any>(
  response: Response,
  slashid: { slashid?: string }
) => {
  const clone = response.clone();
  const data = (await clone.json()) ?? {};

  clone.headers.set("content-type", "application/json");

  return json({ ...(data || {}), ...slashid }, clone) as ReturnType<T & { slashid?: string }>
};

export const addSlashIdToDeferredResponse = async <T extends (...args: any) => any>(
  response: ReturnType<typeof defer>,
  slashid: { slashid?: string }
) => {
  response.data.slashid = slashid;

  return response as ReturnType<T & { slashid?: string }>
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
export const getUser = (args: LoaderFunctionArgs): BaseUser | undefined => {
  const { user } = args.context as { user?: BaseUser };

  return user;
};

export const isResponse = (
  callback: Awaited<RootAuthLoaderCallbackReturn>
): callback is Response => {
  if (callback === null) return false;
  return (
    typeof callback.body !== "undefined" &&
    typeof callback.headers === "object" &&
    typeof callback.status === "number" &&
    typeof callback.statusText === "string"
  );
};

export const isRedirect = ({ status }: Response): boolean => {
  return status >= 300 && status < 400;
};
