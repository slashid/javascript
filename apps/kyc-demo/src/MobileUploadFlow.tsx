import { KYC } from "@slashid/slashid";
import { MobileFlow } from "@slashid/react";
import { useMemo } from "react";
import { config } from "./config";
import { sid } from "./sid";
import { DesignSystemProvider, ContentBlock, Inset } from "design-system";
import { SlashIDProvider } from "@slashid/react";
import { defaultMessages } from "./defaultMessages";

export function MobileUploadFlow() {
  const kyc = useMemo(
    () =>
      new KYC({
        baseURL: config.baseURL,
        organizationId: config.organizationId,
        slashId: sid,
      }),
    []
  );

  return (
    <DesignSystemProvider defaultMessages={defaultMessages}>
      <SlashIDProvider oid={config.organizationId} baseApiUrl={config.baseURL}>
        <ContentBlock maxWidth={700} alignSelf="center">
          <Inset space={40}>
            <MobileFlow mode="hybrid" kyc={kyc} />
          </Inset>
        </ContentBlock>
      </SlashIDProvider>
    </DesignSystemProvider>
  );
}
