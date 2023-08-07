import { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import { useSlashID } from "./use-slash-id";
import { ISlashIDContext } from "../context/slash-id-context";
import { OrganizationDetails } from "@slashid/slashid";

/**
 * A stateful hook providing access to information about organizations the user is a
 * member of. Use this hook to list organizations, see the current organization and
 * switch to another organization.
 *
 * Each instance of this hook will fetch its own organization data, use with caution.
 */
export const useOrganizations = (): {
  organizations: OrganizationDetails[];
  currentOrganization: OrganizationDetails | null;
  switchOrganization: ({ oid }: { oid: string }) => void;
  isLoading: boolean;
} => {
  const { user, __switchOrganizationInContext } = useSlashID();
  const [organizations, setOrganizations] = useState<OrganizationDetails[]>([]);

  useEffect(() => {
    if (!user) return;

    setOrganizations([]);

    user.getOrganizations().then((organizations) => {
      setOrganizations(organizations);
    });
  }, [user]);

  const currentOrganization = useMemo(() => {
    if (!user) return null;

    return organizations.find((org) => org.id === user.oid) ?? null;
  }, [organizations, user]);

  const isLoading = useMemo(
    () => !organizations.length || !currentOrganization,
    [organizations, currentOrganization]
  );

  const switchOrganization = useCallback<
    ISlashIDContext["__switchOrganizationInContext"]
  >(
    ({ oid }) => __switchOrganizationInContext({ oid }),
    [__switchOrganizationInContext]
  );

  return {
    organizations,
    currentOrganization,
    switchOrganization,
    isLoading,
  };
};
