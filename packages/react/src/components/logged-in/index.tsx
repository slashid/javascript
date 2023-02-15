import { useSlashID } from "../../main";

type Props = {
  children: React.ReactNode;
};

/**
 * Renders the children only when the SDK is ready and the user is authenticated.
 */
export const LoggedIn: React.FC<Props> = ({ children }) => {
  const { user } = useSlashID();

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
