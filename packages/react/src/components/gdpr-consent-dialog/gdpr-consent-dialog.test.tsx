import { GDPRConsentLevel, User } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import { GDPRConsentDialog } from ".";
import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { STORAGE_GDPR_CONSENT_KEY } from "../../hooks/use-gdpr-consent";
import { createTestUser } from "../test-utils";
import { TEXT } from "../text/constants";
import { ConsentSettingsLevel } from "./types";
import { CONSENT_LEVELS_WITHOUT_NONE } from "./constants";

const expectDialogToBeOpenWithInitialState = async () => {
  expect(
    await screen.findByText(TEXT["gdpr.dialog.title"])
  ).toBeInTheDocument();

  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-accept")
  ).toBeInTheDocument();
  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-reject")
  ).toBeInTheDocument();
  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-customize")
  ).toBeInTheDocument();

  expect(
    screen.queryByTestId("sid-gdpr-consent-dialog-save")
  ).not.toBeInTheDocument();
};

const expectDialogToBeClosed = async () => {
  await screen.findByTestId("sid-gdpr-consent-dialog-trigger");
  expect(screen.queryByText(TEXT["gdpr.dialog.title"])).not.toBeInTheDocument();
};

const expectDialogToBeOpenWithCustomizingState = async () => {
  CONSENT_LEVELS_WITHOUT_NONE.forEach(async (level) => {
    expect(
      await screen.findByText(TEXT[`gdpr.consent.${level}.title`])
    ).toBeInTheDocument();
  });

  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-save")
  ).toBeInTheDocument();
  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-accept")
  ).toBeInTheDocument();

  expect(
    screen.queryByTestId("sid-gdpr-consent-dialog-reject")
  ).not.toBeInTheDocument();
  expect(
    screen.queryByTestId("sid-gdpr-consent-dialog-customize")
  ).not.toBeInTheDocument();
};

const acceptAllLevels: ConsentSettingsLevel[] = [
  "necessary",
  "analytics",
  "marketing",
  "tracking",
];
const acceptAllConsents = acceptAllLevels.map((consentLevel) => ({
  consent_level: consentLevel,
  // we have to skip the date comparison here because it's not easy to mock the date accurately, testing for consent_level should be enough
  created_at: expect.any(Date),
}));
const rejectAllLevels: GDPRConsentLevel[] = ["none", "necessary"];
const rejectAllConsents = rejectAllLevels.map((consentLevel) => ({
  consent_level: consentLevel,
  created_at: expect.any(Date), // we have to skip the date comparison here too
}));
const saveSettingsLevel: ConsentSettingsLevel[] = ["necessary", "marketing"];
const saveSettingsConsents = saveSettingsLevel.map((consentLevel) => ({
  consent_level: consentLevel,
  created_at: expect.any(Date), // we have to skip the date comparison here too
}));

// pointerEventsCheck: 0 is needed to avoid an error with the dialog component complaining about pointer events set to none in the body
const event = userEvent.setup({ pointerEventsCheck: 0 });
const testUser = createTestUser();

describe("#GDPRConsentDialog", () => {
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
      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-accept"));

      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_GDPR_CONSENT_KEY,
        expect.any(String)
      );
      expect(JSON.parse(setItemSpy.mock.calls[0][1])).toEqual(
        acceptAllConsents.map(({ consent_level }) => ({
          consent_level,
          created_at: expect.any(String),
        }))
      );
      expect(onSuccessMock).toHaveBeenCalledWith(acceptAllConsents);
      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Reject all", async () => {
      getItemSpy.mockReturnValue(null);

      render(
        <TestSlashIDProvider sdkState="ready">
          <GDPRConsentDialog
            defaultRejectAllLevels={rejectAllLevels}
            onSuccess={onSuccessMock}
          />
        </TestSlashIDProvider>
      );

      await expectDialogToBeOpenWithInitialState();
      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-reject"));

      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_GDPR_CONSENT_KEY,
        expect.any(String)
      );
      expect(JSON.parse(setItemSpy.mock.calls[0][1])).toEqual(
        rejectAllConsents.map(({ consent_level }) => ({
          consent_level,
          created_at: expect.any(String),
        }))
      );
      expect(onSuccessMock).toHaveBeenCalledWith(rejectAllConsents);
      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Save settings", async () => {
      getItemSpy.mockReturnValue(
        JSON.stringify([
          { consent_level: "necessary", created_at: new Date() },
          { consent_level: "marketing", created_at: new Date() },
        ])
      );

      render(
        <TestSlashIDProvider sdkState="ready">
          <GDPRConsentDialog
            necessaryCookiesRequired
            onSuccess={onSuccessMock}
          />
        </TestSlashIDProvider>
      );

      await expectDialogToBeClosed();
      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-trigger"));
      await expectDialogToBeOpenWithInitialState();

      await event.click(
        screen.getByTestId("sid-gdpr-consent-dialog-customize")
      );

      await expectDialogToBeOpenWithCustomizingState();

      expect(
        screen.getByTestId("sid-gdpr-consent-switch-necessary")
      ).toHaveAttribute("data-blocked", "true");
      expect(
        screen.getByTestId("sid-gdpr-consent-switch-necessary")
      ).toHaveAttribute("data-state", "checked");
      expect(
        screen.getByTestId("sid-gdpr-consent-switch-marketing")
      ).toHaveAttribute("data-state", "checked");

      expect(
        screen.getByTestId("sid-gdpr-consent-switch-analytics")
      ).toHaveAttribute("data-state", "unchecked");
      expect(
        screen.getByTestId("sid-gdpr-consent-switch-tracking")
      ).toHaveAttribute("data-state", "unchecked");
      expect(
        screen.getByTestId("sid-gdpr-consent-switch-retargeting")
      ).toHaveAttribute("data-state", "unchecked");

      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-save"));

      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_GDPR_CONSENT_KEY,
        expect.any(String)
      );
      expect(JSON.parse(setItemSpy.mock.calls[0][1])).toEqual(
        saveSettingsConsents.map(({ consent_level }) => ({
          consent_level,
          created_at: expect.any(String),
        }))
      );
      expect(onSuccessMock).toHaveBeenCalledWith(saveSettingsConsents);
      await expectDialogToBeClosed();
    });
  });

  describe("logged in user", () => {
    test("should open the dialog by default on first visit in the initial state", async () => {
      getGDPRConsentSpy.mockReturnValue(Promise.resolve({ consents: [] }));
      getItemSpy.mockReturnValue(null);

      render(
        <TestSlashIDProvider sdkState="ready" user={testUser}>
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
        <TestSlashIDProvider sdkState="ready" user={testUser}>
          <GDPRConsentDialog />
        </TestSlashIDProvider>
      );

      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Accept all", async () => {
      getGDPRConsentSpy.mockReturnValue(Promise.resolve({ consents: [] }));
      getItemSpy.mockReturnValue(null);
      setGDPRConsentSpy.mockReturnValue(
        Promise.resolve({ consents: acceptAllConsents })
      );

      render(
        <TestSlashIDProvider sdkState="ready" user={testUser}>
          <GDPRConsentDialog
            defaultAcceptAllLevels={acceptAllLevels}
            onSuccess={onSuccessMock}
          />
        </TestSlashIDProvider>
      );

      await expectDialogToBeOpenWithInitialState();
      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-accept"));

      expect(setGDPRConsentSpy).toHaveBeenCalledWith({
        consentLevels: acceptAllLevels,
      });
      expect(onSuccessMock).toHaveBeenCalledWith(acceptAllConsents);
      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Reject all", async () => {
      getGDPRConsentSpy.mockReturnValue(Promise.resolve({ consents: [] }));
      getItemSpy.mockReturnValue(null);
      setGDPRConsentSpy.mockReturnValue(
        Promise.resolve({ consents: rejectAllConsents })
      );

      render(
        <TestSlashIDProvider sdkState="ready" user={testUser}>
          <GDPRConsentDialog
            defaultRejectAllLevels={rejectAllLevels}
            onSuccess={onSuccessMock}
          />
        </TestSlashIDProvider>
      );

      await expectDialogToBeOpenWithInitialState();
      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-reject"));

      expect(setGDPRConsentSpy).toHaveBeenCalledWith({
        consentLevels: rejectAllLevels,
      });
      expect(onSuccessMock).toHaveBeenCalledWith(rejectAllConsents);
      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Save settings", async () => {
      getGDPRConsentSpy.mockReturnValue(
        Promise.resolve({
          consents: [
            { consent_level: "necessary", created_at: new Date() },
            { consent_level: "marketing", created_at: new Date() },
          ],
        })
      );
      getItemSpy.mockReturnValue(null);
      setGDPRConsentSpy.mockReturnValue(
        Promise.resolve({ consents: saveSettingsConsents })
      );

      render(
        <TestSlashIDProvider sdkState="ready" user={testUser}>
          <GDPRConsentDialog
            necessaryCookiesRequired
            onSuccess={onSuccessMock}
          />
        </TestSlashIDProvider>
      );

      await expectDialogToBeClosed();
      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-trigger"));
      await expectDialogToBeOpenWithInitialState();

      await event.click(
        screen.getByTestId("sid-gdpr-consent-dialog-customize")
      );

      await expectDialogToBeOpenWithCustomizingState();

      expect(
        screen.getByTestId("sid-gdpr-consent-switch-necessary")
      ).toHaveAttribute("data-blocked", "true");
      expect(
        screen.getByTestId("sid-gdpr-consent-switch-necessary")
      ).toHaveAttribute("data-state", "checked");
      expect(
        screen.getByTestId("sid-gdpr-consent-switch-marketing")
      ).toHaveAttribute("data-state", "checked");

      expect(
        screen.getByTestId("sid-gdpr-consent-switch-analytics")
      ).toHaveAttribute("data-state", "unchecked");
      expect(
        screen.getByTestId("sid-gdpr-consent-switch-tracking")
      ).toHaveAttribute("data-state", "unchecked");
      expect(
        screen.getByTestId("sid-gdpr-consent-switch-retargeting")
      ).toHaveAttribute("data-state", "unchecked");

      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-save"));

      expect(setGDPRConsentSpy).toHaveBeenCalledWith({
        consentLevels: saveSettingsLevel,
      });
      expect(onSuccessMock).toHaveBeenCalledWith(saveSettingsConsents);
      await expectDialogToBeClosed();
    });
  });
});
