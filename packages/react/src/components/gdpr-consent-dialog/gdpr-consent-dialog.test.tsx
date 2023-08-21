import { User } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import { GDPRConsentDialog } from ".";
import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { STORAGE_GDPR_CONSENT_KEY } from "../../hooks/use-gdpr-consent";
import { createTestUser } from "../test-utils";
import { TEXT } from "../text/constants";
import { ConsentSettingsLevel } from "./types";

const expectDialogToBeOpenWithInitialState = async () => {
  expect(
    await screen.findByText(TEXT["gdpr.dialog.title"])
  ).toBeInTheDocument();

  expect(
    screen.queryByTestId("sid-gdpr-consent-dialog-save")
  ).not.toBeInTheDocument();
  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-accept")
  ).toBeInTheDocument();
  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-reject")
  ).toBeInTheDocument();
  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-customize")
  ).toBeInTheDocument();
};

const expectDialogToBeClosed = async () => {
  await screen.findByTestId("sid-gdpr-consent-dialog-trigger");
  expect(screen.queryByText(TEXT["gdpr.dialog.title"])).not.toBeInTheDocument();
};

describe("#GDPRConsentDialog", () => {
  const acceptAllLevels: ConsentSettingsLevel[] = [
    "necessary",
    "analytics",
    "marketing",
  ];
  const user = userEvent.setup({ pointerEventsCheck: 0 });
  const onSuccessMock = vi.fn();
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
  const getGDPRConsentSpy = vi.spyOn(User.prototype, "getGDPRConsent");
  const setGDPRConsentSpy = vi.spyOn(User.prototype, "setGDPRConsent");

  afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
    setItemSpy.mockClear();
    getGDPRConsentSpy.mockClear();
    setGDPRConsentSpy.mockClear();
  });

  describe("anonymous user", () => {
    test("should open the dialog by default on first visit in the initial state", async () => {
      render(
        <TestSlashIDProvider sdkState="ready">
          <GDPRConsentDialog />
        </TestSlashIDProvider>
      );

      expectDialogToBeOpenWithInitialState();
    });

    test("should not open the dialog by default on second visit", async () => {
      getItemSpy.mockReturnValue(
        JSON.stringify([{ consent_level: "necessary", created_at: new Date() }])
      );

      render(
        <TestSlashIDProvider sdkState="ready">
          <GDPRConsentDialog />
        </TestSlashIDProvider>
      );

      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Accept all", async () => {
      getItemSpy.mockReturnValue(null);

      render(
        <TestSlashIDProvider sdkState="ready">
          <GDPRConsentDialog
            defaultAcceptAllLevels={acceptAllLevels}
            onSuccess={onSuccessMock}
          />
        </TestSlashIDProvider>
      );

      await expectDialogToBeOpenWithInitialState();
      await user.click(screen.getByTestId("sid-gdpr-consent-dialog-accept"));

      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_GDPR_CONSENT_KEY,
        expect.any(String)
      );
      expect(JSON.parse(setItemSpy.mock.calls[0][1])).toEqual(
        acceptAllLevels.map((consentLevel) => ({
          consent_level: consentLevel,
          created_at: expect.any(String),
        }))
      );
      expect(onSuccessMock).toHaveBeenCalledWith(
        acceptAllLevels.map((consentLevel) => ({
          consent_level: consentLevel,
          created_at: expect.any(Date),
        }))
      );
      await expectDialogToBeClosed();
    });
  });

  describe("logged in user", () => {
    test("should open the dialog by default on first visit in the initial state", async () => {
      getGDPRConsentSpy.mockReturnValue(Promise.resolve({ consents: [] }));
      getItemSpy.mockReturnValue(null);

      render(
        <TestSlashIDProvider sdkState="ready" user={createTestUser()}>
          <GDPRConsentDialog />
        </TestSlashIDProvider>
      );

      expectDialogToBeOpenWithInitialState();
    });

    test("should not open the dialog by default on second visit", async () => {
      getGDPRConsentSpy.mockReturnValue(
        Promise.resolve({
          consents: [{ consent_level: "necessary", created_at: new Date() }],
        })
      );

      render(
        <TestSlashIDProvider sdkState="ready" user={createTestUser()}>
          <GDPRConsentDialog />
        </TestSlashIDProvider>
      );

      await expectDialogToBeClosed();
    });
  });
});
