import { useQuery } from "@tanstack/react-query";
import { useSlashID } from "./use-slash-id";

export function useOrganizations() {
  const { isAuthenticated, user } = useSlashID();

  const result = useQuery({
    queryKey: ["organizations", user?.oid],
    queryFn: () => {
      return user?.getOrganizations();
    },
    enabled: isAuthenticated,
  });

  return result;
}
