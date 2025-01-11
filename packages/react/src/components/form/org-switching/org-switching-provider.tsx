import { ReactNode } from "react";
import { useOrgSwitchingContext } from "./useOrgSwitchingContext";

type Props = {
  children: ReactNode;
  authUI: ReactNode;
};

export function OrgSwitchingProvider({ children, authUI }: Props) {
  const ctx = useOrgSwitchingContext();

  if (ctx.state === "switching") {
    return <>{authUI}</>;
  }

  return <>{children}</>;
}
