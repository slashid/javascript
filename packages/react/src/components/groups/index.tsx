import { ReactNode, useMemo } from "react";
import { useSlashID } from "../../main";

type Props = {
  belongsTo: string | ((groups: string[]) => boolean);
  children: ReactNode
}

/**
 * Conditional rendering helper.
 * 
 * Use this component where some content should be shown only to users belonging to one or more specific groups.
 * 
 * @param belongsTo group name or predicate function - the predicate function is called with a list of group names that the user belongs to.
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
 *  belongsTo={Groups.some(["admin", "user"])}
 * >
 *  ...
 * </Groups>
 * ```
 * 
 * @example
 * User belongs to both "admin" and "user"
 * ```tsx
 * <Groups
 *  belongsTo={Groups.all(["admin", "user"])}
 * >
 *  ...
 * </Groups>
 * ```
 */
export const Groups = ({ belongsTo, children }: Props) => {
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

Groups.some = (groups: string[]) => (userGroups: string[]) => groups.some(group => userGroups.includes(group))
Groups.all = (groups: string[]) => (userGroups: string[]) => groups.every(group => userGroups.includes(group))
