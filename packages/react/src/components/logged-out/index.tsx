import { useSlashID } from "../../main";
import { SlashIDLoaded } from "../loaded";

type Props = {
  children: React.ReactNode;
};

/**
 * Renders the children only when the SDK is ready and the user is not authenticated.
 */
export const LoggedOut: React.FC<Props> = (props) => {
  return (
    <SlashIDLoaded>
      <LoggedOutGuard
        {...props}
      />
    </SlashIDLoaded>
  )
}

const LoggedOutGuard: React.FC<Props> = ({ children }) => {
  const { user } = useSlashID();

  if (user) {
    return null;
  }

  return <>{children}</>;
};