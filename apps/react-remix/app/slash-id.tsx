import type { Factor } from "@slashid/slashid";
import type { ReactNode } from "react";
import { SlashIDProvider, ConfigurationProvider } from "@slashid/react";

type Props = {
  children: ReactNode;
};

export const SlashID = ({ children }: Props) => {
  const factors: Factor[] = [{ method: "email_link" }];

  return (
    <SlashIDProvider
      environment="sandbox"
      oid="ORG_ID"
      tokenStorage="localStorage"
    >
      <ConfigurationProvider factors={factors}>
        {children}
      </ConfigurationProvider>
    </SlashIDProvider>
  );
};
