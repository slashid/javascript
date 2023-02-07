import { useMemo } from "react";
import { useSlashID } from "../../main";

type Groups = string[];

type Props = {
  belongsTo: (groups: Groups) => boolean;
  children: React.ReactNode;
};

/**
 * Requires a callback function to be passed in. This callback will be called with an array of names of groups the user belongs to.
 * Renders children only if the callback returns true.
 */
export const Groups: React.FC<Props> = ({ belongsTo, children }) => {
  const { user } = useSlashID();

  const shouldRender = useMemo(() => {
    if (!user) {
      return false;
    }

    return belongsTo(user.getGroups());
  }, [user, belongsTo]);

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
};
