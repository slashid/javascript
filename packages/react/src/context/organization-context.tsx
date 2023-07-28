import { OrganizationDetails } from "@slashid/slashid";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useSlashID } from "../main";

export interface IOrganizationContext {
  organizations: OrganizationDetails[]
  currentOrganization: OrganizationDetails | null
  isLoading: boolean
}

export const initialContextValue: IOrganizationContext = {
  organizations: [],
  currentOrganization: null,
  isLoading: true
};

export const OrganizationContext =
  createContext<IOrganizationContext>(initialContextValue);
OrganizationContext.displayName = "SlashIDOrganizationContext";

type Props = {
  children: ReactNode;
};

export const OrganizationProvider: React.FC<Props> = ({ children }) => {
  const { user, __defaultOrgCheckComplete } = useSlashID()
  const [organizations, setOrganizations] = useState<OrganizationDetails[]>([])

  const currentOrganization = useMemo(() => {
    if (!user || !__defaultOrgCheckComplete) return null

    return organizations.find(org => org.id === user.oid) ?? null
  }, [organizations, user, user?.oid])

  const isLoading = useMemo(() => Boolean(!organizations.length) || !currentOrganization, [organizations])

  useEffect(() => {
    if (!user || !isLoading) return
    
    user.getOrganizations()
      .then(({ organizations }) => {
        setOrganizations(organizations)
      })
  }, [user])


  const contextValue = useMemo(() => {
    return {
      organizations,
      isLoading,
      currentOrganization
    };
  }, [organizations, isLoading, currentOrganization]);

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};
