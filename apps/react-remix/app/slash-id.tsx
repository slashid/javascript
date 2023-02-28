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
      oid="ad5399ea-4e88-b04a-16ca-82958c955740"
      tokenStorage="localStorage"
    >
      <ConfigurationProvider factors={factors}>
        {children}
      </ConfigurationProvider>
    </SlashIDProvider>
  );
};
