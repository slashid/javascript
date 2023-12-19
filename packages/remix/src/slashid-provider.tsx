import {
  SlashIDContext,
  SlashIDProvider as ReactSlashIDProvider,
  SlashIDProviderProps,
  useSlashID,
} from "@slashid/react";
import { SSR, User } from "@slashid/slashid";
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
  const value = useMemo(() => {
    const user = props.initialToken
      ? (new SSR.User(props.initialToken) as User)
      : undefined;
    return {
      sid: undefined,
      // TODO remember to pass the options to the User
      user,
      sdkState: user ? ("ready" as const) : ("initial" as const),
      // this might require a bit more work
      logOut: user
        ? () => {
            user.logout();
            return undefined;
          }
        : () => undefined,
      logIn: () => Promise.reject("Operation not possible in this state"),
      mfa: () => Promise.reject("Operation not possible in this state"),
      validateToken: async () => false,
      __switchOrganizationInContext: async () => undefined,
    };
  }, [props.initialToken]);

  return (
    <SlashIDContext.Provider value={value}>{children}</SlashIDContext.Provider>
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
