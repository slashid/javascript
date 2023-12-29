import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { isDeferredData } from "@remix-run/server-runtime/dist/responses";
import {
  addSlashIdToDeferredResponse,
  addSlashIdToResponse,
  assertCallbackResult,
  getUserTokenFromCookies,
  isRedirect,
  isResponse,
} from "./util";
import { RootAuthLoaderCallback, isCallbackDefined } from "./callback";
import { verifyToken } from "./verify";
import { SSR } from "@slashid/slashid";

type RootLoaderSlashIDContext = {
  baseApiUrl: string;
  sdkUrl: string;
  analyticsEnabled?: boolean;
  oid: string;
};

const defaultCallback: any = () => ({});

export const rootLoader =
  (context: RootLoaderSlashIDContext) =>
  <T extends RootAuthLoaderCallback>(callback: T = defaultCallback) =>
  async (args: LoaderFunctionArgs): Promise<ReturnType<T>> => {
    const token = getUserTokenFromCookies(args.request.headers.get("cookie"));

    const verified = await verifyToken({
      token,
      baseApiUrl: context.baseApiUrl,
      oid: context.oid,
    })
      .then(() => true)
      .catch(() => false);

    const slashid = {
      slashid: verified ? token : undefined,
    };

    if (!isCallbackDefined(callback)) {
      return addSlashIdToResponse(new Response(JSON.stringify({})), slashid);
    }

    const user =
      verified && token
        ? new SSR.User(token, {
            baseURL: context.baseApiUrl,
            oid: context.oid,
            sdkURL: context.sdkUrl,
            analyticsEnabled: context.analyticsEnabled,
          })
        : undefined;

    const callbackResult = await callback({
      ...args,
      context: {
        ...args.context,
        user,
      },
    });
    assertCallbackResult(callbackResult);

    if (isDeferredData(callbackResult)) {
      return addSlashIdToDeferredResponse(callbackResult as any, slashid);
    }

    if (!isResponse(callbackResult)) {
      /**
       * If it's not a response then it's a POJO or null
       *
       * For this case, we apply the same behaviour as if there was no callback
       */
      const body = callbackResult ?? {};
      return addSlashIdToResponse(new Response(JSON.stringify(body)), slashid);
    }

    try {
      // don't modify the request, it's a redirect
      if (isRedirect(callbackResult)) return callbackResult as any;

      return addSlashIdToResponse(callbackResult, slashid);
    } catch {
      throw new Error("Bad response format in callback");
    }
  };
