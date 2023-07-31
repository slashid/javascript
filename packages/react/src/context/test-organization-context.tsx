import React, { useMemo } from "react";
import { IOrganizationContext, OrganizationContext, initialContextValue } from "./organization-context";

type TestProviderProps = Partial<IOrganizationContext> & {
  children: React.ReactNode;
};

export const TestOrganizationProvider: React.FC<TestProviderProps> = ({ children }) => {
  const value = useMemo(
    () => ({
      ...initialContextValue,
    }),
    []
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
