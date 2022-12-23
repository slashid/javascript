import { useSlashID } from "../../main";

type Props = {
  children: React.ReactNode;
};

/**
 * Renders the children only when the SDK is ready and the user is authenticated.
 */
export const LoggedIn: React.FC<Props> = ({ children }) => {
  const { user, sdkState } = useSlashID();

  if (sdkState !== "ready" || (sdkState === "ready" && !user)) {
    return null;
  }

  return <>{children}</>;
};
