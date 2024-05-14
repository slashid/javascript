import {
  SlashIDContext,
  ISlashIDContext,
  SlashIDProvider as ReactSlashIDProvider,
  SlashIDProviderProps,
  useSlashID,
  ServerThemeRoot,
} from "@slashid/react";
import { AnonymousUser, SSR, SlashIDOptions, User } from "@slashid/slashid";
import { useEffect, useMemo, useState } from "react";

export type RemixSlashIDProviderOptions = Omit<
  SlashIDProviderProps,
  "tokenStorage"
>;

/**
 * Renders server side - skips to "ready" state in case a token is provided.
 * Does not react to any changes - it's a static provider.
 * @param param0
 * @returns
 */
function SlashIDProviderSSR({
  children,
  ...props
}: RemixSlashIDProviderOptions) {
  const value: ISlashIDContext = useMemo(() => {
    const options: SlashIDOptions = {
      baseURL: props.baseApiUrl,
      sdkURL: props.sdkUrl,
      oid: props.oid,
      analyticsEnabled: props.analyticsEnabled,
    };

    const user = props.initialToken
      ? new SSR.User(props.initialToken, options)
      : undefined;

    return {
      sid: undefined,
      user: user?.anonymous ? undefined : (user as User),
      anonymousUser: user?.anonymous ? (user as AnonymousUser) : undefined,
      sdkState: user ? ("ready" as const) : ("initial" as const),
      logOut: () => {
        throw new Error("Operation not possible in this state");
      },
      logIn: () => Promise.reject("Operation not possible in this state"),
      mfa: () => Promise.reject("Operation not possible in this state"),
      recover: () => Promise.reject("Operation not possible in this state"),
      validateToken: async () => false,
      __switchOrganizationInContext: async () => undefined,
    };
  }, [
    props.analyticsEnabled,
    props.baseApiUrl,
    props.initialToken,
    props.oid,
    props.sdkUrl,
  ]);

  return (
    <ServerThemeRoot>
      <SlashIDContext.Provider value={value}>
        {children}
      </SlashIDContext.Provider>
    </ServerThemeRoot>
  );
}

function InnerSlashIDProvider({
  children,
  ...props
}: RemixSlashIDProviderOptions) {
  const { sdkState } = useSlashID();

  if (sdkState !== "ready") {
    return <SlashIDProviderSSR {...props}>{children}</SlashIDProviderSSR>;
  }

  return <>{children}</>;
}

export const SlashIDProvider = ({
  children,
  ...props
}: RemixSlashIDProviderOptions) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // prevent hydration errors - trigger a render cycle after hydration, before that render the SSR provider
    setHydrated(true);
  }, [hydrated]);

  if (!hydrated) {
    return <SlashIDProviderSSR {...props}>{children}</SlashIDProviderSSR>;
  }

  // once hydrated, render the client side provider
  // TODO this has a side effect of only processing DirectID client side - first render will be based on the cookie
  return (
    <ReactSlashIDProvider {...props} tokenStorage="cookie">
      <InnerSlashIDProvider {...props}>{children}</InnerSlashIDProvider>
    </ReactSlashIDProvider>
  );
};
