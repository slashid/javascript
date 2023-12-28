import { LoaderFunctionArgs, LoaderFunction } from "@remix-run/server-runtime";
import { isDeferredData } from "@remix-run/server-runtime/dist/responses";
import {
  addSlashIdToDeferredResponse,
  addSlashIdToRequest,
  addSlashIdToResponse,
  assertCallbackResult,
  getUserTokenFromCookies,
  isRedirect,
  isResponse,
} from "./util";
import { RootAuthLoaderCallback, isCallbackDefined } from "./callback";
import { verifyToken } from "./verify";

export interface RootLoader {
  <T extends RootAuthLoaderCallback>(
    args: LoaderFunctionArgs,
    callback: T
  ): Promise<ReturnType<T>>;

  (args: LoaderFunctionArgs): Promise<ReturnType<LoaderFunction>>;
}

// @ts-ignore
export const rootAuthLoader: RootLoader = async (
  args: LoaderFunctionArgs & { sid: { baseApiUrl: string, oid: string } },
  callback: any
): Promise<ReturnType<LoaderFunction>> => {
  const token = getUserTokenFromCookies(args.request.headers.get("cookie"));

  const verified = await verifyToken({ token, baseApiUrl: args.sid.baseApiUrl, oid: args.sid.oid })
      .then(() => true)
      .catch(() => false)

  console.log("token verified?", verified)

  const slashid = {
    slashid: verified
      ? token
      : undefined,
  };

  if (!isCallbackDefined(callback)) {
    return addSlashIdToResponse(new Response(JSON.stringify({})), slashid);
  }

  // TODO: handle pattern where user provides a callback for their own
  //       root loader behaviour/data fetching
  const callbackResult = await callback(addSlashIdToRequest(args, slashid));
  assertCallbackResult(callbackResult);

  if (isDeferredData(callbackResult)) {
    return addSlashIdToDeferredResponse(callbackResult as any, slashid);
  }

  // TODO: not implemented
  if (isResponse(callbackResult)) {
    try {
      // don't modify the request, it's a redirect
      if (isRedirect(callbackResult)) return callbackResult;
      return addSlashIdToResponse(callbackResult, slashid);
    } catch {
      throw new Error("Bad response format in callback");
    }
  }

  /**
   * The remaining case is that the response is a POJO or a falsy value like null
   *
   * For this case, we apply the same behaviour as if there was no callback
   */
  const body = callbackResult ?? {};
  return addSlashIdToResponse(new Response(JSON.stringify(body)), slashid);
};
