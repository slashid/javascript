import React, { useMemo } from "react";
import {
  OrganizationContext,
  initialContextValue,
} from "./organization-context";
import { UseOrganizations } from "../hooks/use-organizations";

type TestProviderProps = Partial<UseOrganizations> & {
  children: React.ReactNode;
};

export const TestOrganizationProvider: React.FC<TestProviderProps> = ({
  children,
  isLoading,
  currentOrganization,
  organizations,
  switchOrganization,
}) => {
  const value = useMemo(
    () => ({
      ...initialContextValue,
      isLoading: isLoading ?? initialContextValue.isLoading,
      currentOrganization:
        currentOrganization ?? initialContextValue.currentOrganization,
      organizations: organizations ?? initialContextValue.organizations,
    }),
    []
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
