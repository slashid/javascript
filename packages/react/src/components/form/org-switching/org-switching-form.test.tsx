import { describe, it } from "vitest";
import { createTestUser, testToken } from "../../test-utils";
import { render, screen } from "@testing-library/react";
import { TestSlashIDProvider } from "../../../context/test-providers";
import { ConfigurationProvider } from "../../../context/config-context";
import { OrgSwitchingForm } from "./org-switching-form";
import { User } from "@slashid/slashid";
import { SlashID } from "@slashid/slashid";

describe("<OrgSwitchingForm>", () => {
  it("should show success state after org switching", async () => {
    const oid = "test-oid";
    const oid2 = "test-oid2";
    const sid = new SlashID({ oid });
    const testUser = createTestUser({ sid });

    // @ts-ignore
    testUser._apiClient = {
      postTokenV2: async () => {
        return {
          result: {
            type: "token",
            token: testToken,
          },
        };
      },
    };

    const __switchOrganizationInContext = async ({
      oid: newOid,
    }: {
      oid: string;
    }) => {
      const newToken = await testUser.getTokenForOrganization(newOid);

      return new User(newToken, sid);
    };

    render(
      <TestSlashIDProvider
        sdkState="ready"
        sid={sid}
        user={testUser}
        __switchOrganizationInContext={__switchOrganizationInContext}
      >
        <ConfigurationProvider>
          <OrgSwitchingForm oid={oid2} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
  });

  it("should show OTP input", async () => {
    const oid = "test-oid";
    const oid2 = "test-oid2";
    const sid = new SlashID({ oid });
    const testUser = createTestUser({ sid });

    // @ts-ignore
    testUser._apiClient = {
      postTokenV2: async () => {
        return {
          result: {
            type: "challenge_list",
            challenges: [
              {
                id: "gNbbLKbG1Zt5Ep6Wl6dpNw",
                options: {
                  target_org_id: "8e669bb5-f4a7-2a3f-fec6-3d6f96f6dd26",
                  factor: {
                    method: "otp_via_email",
                    options: undefined,
                  },
                },
                type: "authn_context_update",
                authentication_method: "otp_via_email",
              },
              {
                authentication_method: "otp_via_email",
                id: "FZ8txUDp-iHnqUfQcTcU9g",
                type: "otp",
              },
            ],
          },
        };
      },
    };

    const __switchOrganizationInContext = async ({
      oid: newOid,
    }: {
      oid: string;
    }) => {
      const newToken = await testUser.getTokenForOrganization(newOid);

      return new User(newToken, sid);
    };

    render(
      <TestSlashIDProvider
        sdkState="ready"
        sid={sid}
        user={testUser}
        __switchOrganizationInContext={__switchOrganizationInContext}
      >
        <ConfigurationProvider>
          <OrgSwitchingForm oid={oid2} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    await expect(
      screen.findByTestId("sid-form-authenticating-otp")
    ).resolves.toBeInTheDocument();
  });
});
