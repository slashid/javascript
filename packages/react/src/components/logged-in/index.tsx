import type { Factor, User } from "@slashid/slashid";
import { useMemo } from "react";
import { useSlashID } from "../../hooks/use-slash-id";

type FactorMethods = Factor["method"][];

type Props = {
  children: React.ReactNode;
  withFactorMethods?:
    | FactorMethods
    | ((userAuthenticationMethods: FactorMethods) => boolean);
};

const hasUserAuthenticationMethods = (user: User, methods: FactorMethods) => {
  for (const factorMethod of methods) {
    if (!user.authentication.includes(factorMethod)) {
      return false;
    }
  }

  return true;
};

/**
 * Renders the children only when the SDK is ready and the user is authenticated.
 */
export const LoggedIn: React.FC<Props> = ({ children, withFactorMethods }) => {
  const { user } = useSlashID();

  const shouldRender = useMemo(() => {
    // user must be logged in
    if (!user) {
      return false;
    }

    // user must be authenticated with all factor methods
    if (withFactorMethods && Array.isArray(withFactorMethods)) {
      return hasUserAuthenticationMethods(user, withFactorMethods);
    }

    // callback function must return `true`
    if (withFactorMethods && typeof withFactorMethods === "function") {
      return withFactorMethods(user.authentication);
    }

    return true;
  }, [user, withFactorMethods]);

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
};
