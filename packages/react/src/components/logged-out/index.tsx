import { useSlashID } from "../../main";
import { SlashIDLoaded } from "../loaded";

type Props = {
  children: React.ReactNode;
};

/**
 * Renders the children only when the SDK is ready and the user is not authenticated.
 */
export const LoggedOut = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useSlashID();

  if (isAuthenticated || isLoading) {
    return null;
  }

  return children
}