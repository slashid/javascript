import type { Factor } from "@slashid/slashid";
import { ReactNode, useEffect } from "react";
import { SlashIDProvider, ConfigurationProvider } from "@slashid/react";

type Props = {
  children: ReactNode;
};

export const SlashID = ({ children }: Props) => {
  const factors: Factor[] = [{ method: "email_link" }];

  return (
    <SlashIDProvider
      baseApiUrl="https://api.sandbox.slashid.com"
      oid={"817b1d29-3800-bc0c-36eb-83ab632f66a5"}
      tokenStorage="localStorage"
    >
      <ConfigurationProvider factors={factors}>
        {children}
      </ConfigurationProvider>
    </SlashIDProvider>
  );
};
