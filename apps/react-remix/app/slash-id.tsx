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
      baseApiUrl="https://api.sandbox.slashid.com"
      oid="f978a6bd-3e45-bcda-cb4e-573d0bad155b"
      tokenStorage="localStorage"
    >
      <ConfigurationProvider factors={factors} storeLastHandle={true}>
        {children}
      </ConfigurationProvider>
    </SlashIDProvider>
  );
};
