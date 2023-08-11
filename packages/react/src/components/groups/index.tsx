import { ReactNode, useMemo } from "react";
import { useSlashID } from "../../main";

type Groups = string[];

type Props = {
  belongsTo: string | ((groups: Groups) => boolean);
  children: ReactNode;
};

/**
 * Conditional rendering helper.
 * 
 * Use this component where some content should be shown only to users belonging to one or more specific groups.
 * 
 * @param belongsTo string or predicate function - the predicate function is called with a list of group names that the user belongs to.
 * 
 * @example
 * User belongs to group "admin"
 * ```tsx
 * <Groups
 *  belongsTo="admin"
 * >
 *  ...
 * </Groups>
 * ```
 * 
 * @example
 * User belongs to either "admin" or "user"
 * ```tsx
 * <Groups
 *  belongsTo={groups => 
 *    ["admin", "user"].some(group => groups.includes(group))
 *  }
 * >
 *  ...
 * </Groups>
 * ```
 * 
 * @example
 * User belongs to both "admin" and "user"
 * ```tsx
 * <Groups
 *  belongsTo={groups =>
 *    ["admin", "user"].every(group => groups.includes(group))
 *  }
 * >
 *  ...
 * </Groups>
 * ```
 */
export const Groups: React.FC<Props> = ({ belongsTo, children }) => {
  const { user } = useSlashID();

  const shouldRender = useMemo(() => {
    if (!user) {
      return false;
    }
    const groups = user.getGroups()

    return typeof belongsTo === "string"
      ? groups.includes(belongsTo)
      : belongsTo(groups)
  }, [user, belongsTo]);

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
};
