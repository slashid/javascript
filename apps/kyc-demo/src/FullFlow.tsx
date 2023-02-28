import { KYCFlow } from "./KYCFlow";
import { Login } from "./steps/Login";
import { Inset, Column, Columns, ContentBlock } from "design-system";
import { SlashIDProvider, useSlashID } from "@slashid/react";
import { config } from "./config";

export function FullFlow() {
  return (
    <SlashIDProvider oid={config.organizationId} baseApiUrl={config.baseURL}>
      <Index />
    </SlashIDProvider>
  );
}

function Index() {
  const { user } = useSlashID();
  return (
    <Columns space={0} align="center">
      <Column width={{ desktop: "1/3", mobile: "full" }}>
        <ContentBlock maxWidth={700} alignSelf="center">
          <Inset space={{ desktop: 40, mobile: 16 }}>
            {user ? <KYCFlow /> : <Login />}
          </Inset>
        </ContentBlock>
      </Column>
    </Columns>
  );
}
