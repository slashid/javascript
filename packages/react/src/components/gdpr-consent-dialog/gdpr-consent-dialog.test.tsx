import { GDPRConsent, GDPRConsentLevel, User } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { describe } from "vitest";
import { GDPRConsentDialog } from ".";
import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { STORAGE_GDPR_CONSENT_KEY } from "../../hooks/use-gdpr-consent";
import { createTestUser } from "../test-utils";
import { TEXT } from "../text/constants";
import { CONSENT_LEVELS_WITHOUT_NONE } from "./constants";
import { ConsentSettingsLevel } from "./types";

const mapLevelsToConsents = (
  levels: (ConsentSettingsLevel | GDPRConsentLevel)[],
  createdAtType: unknown = Date
): GDPRConsent[] =>
  levels.map((consentLevel) => ({
    consent_level: consentLevel,
    // we have to skip the date comparison here because it's not easy to mock the date accurately, testing for consent_level should be enough
    created_at: expect.any(createdAtType),
  }));

const event = userEvent.setup({
  // this is needed to avoid an error with the dialog component complaining about pointer events set to none in the body
  pointerEventsCheck: PointerEventsCheckLevel.Never,
});

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

const expectDialogToBeOpenWithCustomizingState = async (
  consentSettingsLevels: ConsentSettingsLevel[]
) => {
  CONSENT_LEVELS_WITHOUT_NONE.forEach(async (level) => {
    const isChecked = consentSettingsLevels.includes(level);

    expect(
      await screen.findByText(TEXT[`gdpr.consent.${level}.title`])
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("sid-gdpr-consent-switch-necessary")
    ).toHaveAttribute("data-blocked", "true");
    expect(
      screen.getByTestId(`sid-gdpr-consent-switch-${level}`)
    ).toHaveAttribute("data-state", isChecked ? "checked" : "unchecked");
  });

  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-save")
  ).toBeInTheDocument();
  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-accept")
  ).toBeInTheDocument();
  expect(
    screen.getByTestId("sid-gdpr-consent-dialog-reject")
  ).toBeInTheDocument();

  expect(
    screen.queryByTestId("sid-gdpr-consent-dialog-customize")
  ).not.toBeInTheDocument();
};

const toggleConsentSettings = async (
  consentSettingsLevels: ConsentSettingsLevel[]
) => {
  CONSENT_LEVELS_WITHOUT_NONE.filter((level) => level !== "necessary").forEach(
    async (level) => {
      const switchButton = screen.getByTestId(
        `sid-gdpr-consent-switch-${level}`
      );
      const isAlreadyChecked =
        switchButton.getAttribute("data-state") === "checked";
      const shouldToggleOn = consentSettingsLevels.includes(level);

      if (isAlreadyChecked !== shouldToggleOn) {
        // we only need to toggle the settings that have a different state
        await event.click(switchButton);
      }

      expect(switchButton).toHaveAttribute(
        "data-state",
        shouldToggleOn ? "checked" : "unchecked"
      );
    }
  );
};

describe("#GDPRConsentDialog", () => {
  const testUser = createTestUser();
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
        JSON.stringify(mapLevelsToConsents(["necessary"]))
      );

      render(
        <TestSlashIDProvider sdkState="ready">
          <GDPRConsentDialog />
        </TestSlashIDProvider>
      );

      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Accept all", async () => {
      const acceptAllLevels = [...CONSENT_LEVELS_WITHOUT_NONE];

      getItemSpy.mockReturnValue(null);

      render(
        <TestSlashIDProvider sdkState="ready">
          <GDPRConsentDialog onSuccess={onSuccessMock} />
        </TestSlashIDProvider>
      );

      await expectDialogToBeOpenWithInitialState();
      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-accept"));

      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_GDPR_CONSENT_KEY,
        expect.any(String)
      );
      expect(JSON.parse(setItemSpy.mock.calls[0][1])).toEqual(
        mapLevelsToConsents(acceptAllLevels, String)
      );
      expect(onSuccessMock).toHaveBeenCalledWith(
        mapLevelsToConsents(acceptAllLevels)
      );
      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Reject all", async () => {
      const rejectAllLevels: GDPRConsentLevel[] = ["none"];

      getItemSpy.mockReturnValue(null);

      render(
        <TestSlashIDProvider sdkState="ready">
          <GDPRConsentDialog onSuccess={onSuccessMock} />
        </TestSlashIDProvider>
      );

      await expectDialogToBeOpenWithInitialState();
      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-reject"));

      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_GDPR_CONSENT_KEY,
        expect.any(String)
      );
      expect(JSON.parse(setItemSpy.mock.calls[0][1])).toEqual(
        mapLevelsToConsents(rejectAllLevels, String)
      );
      expect(onSuccessMock).toHaveBeenCalledWith(
        mapLevelsToConsents(rejectAllLevels)
      );
      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Save settings", async () => {
      const loadedLevels: ConsentSettingsLevel[] = ["necessary", "analytics"];
      const LevelsToSave: ConsentSettingsLevel[] = [
        "necessary",
        "marketing",
        "tracking",
      ];

      getItemSpy.mockReturnValue(
        JSON.stringify(mapLevelsToConsents(loadedLevels))
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

      await expectDialogToBeOpenWithCustomizingState(loadedLevels);

      // toggle the switches to the desired states to save
      await toggleConsentSettings(LevelsToSave);

      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-save"));

      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_GDPR_CONSENT_KEY,
        expect.any(String)
      );
      expect(JSON.parse(setItemSpy.mock.calls[0][1])).toEqual(
        mapLevelsToConsents(LevelsToSave, String)
      );
      expect(onSuccessMock).toHaveBeenCalledWith(
        mapLevelsToConsents(LevelsToSave)
      );
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
        Promise.resolve({ consents: mapLevelsToConsents(["necessary"]) })
      );

      render(
        <TestSlashIDProvider sdkState="ready" user={testUser}>
          <GDPRConsentDialog />
        </TestSlashIDProvider>
      );

      await expectDialogToBeClosed();
    });

    test("should save the consents and close the dialog when user clicks on Accept all", async () => {
      const acceptAllLevels: ConsentSettingsLevel[] = [
        "necessary",
        "analytics",
        "marketing",
        "tracking",
      ];
      const acceptAllConsents = mapLevelsToConsents(acceptAllLevels);

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
      const rejectAllLevels: GDPRConsentLevel[] = ["none", "necessary"];
      const rejectAllConsents = mapLevelsToConsents(rejectAllLevels);

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
      const loadedLevels: ConsentSettingsLevel[] = ["necessary", "retargeting"];
      const LevelsToSave: ConsentSettingsLevel[] = [
        "necessary",
        "analytics",
        "marketing",
      ];
      const consentsToSave = mapLevelsToConsents(LevelsToSave);

      getGDPRConsentSpy.mockReturnValue(
        Promise.resolve({ consents: mapLevelsToConsents(loadedLevels) })
      );
      getItemSpy.mockReturnValue(null);
      setGDPRConsentSpy.mockReturnValue(
        Promise.resolve({ consents: consentsToSave })
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

      await expectDialogToBeOpenWithCustomizingState(loadedLevels);

      // toggle the switches to the desired states to save
      await toggleConsentSettings(LevelsToSave);

      await event.click(screen.getByTestId("sid-gdpr-consent-dialog-save"));

      expect(setGDPRConsentSpy).toHaveBeenCalledWith({
        consentLevels: LevelsToSave,
      });
      expect(onSuccessMock).toHaveBeenCalledWith(consentsToSave);
      await expectDialogToBeClosed();
    });
  });
});
