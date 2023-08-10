import { GDPRConsent, GDPRConsentLevel, User } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import { TEST_ORG_ID, createTestUser } from "../components/test-utils";
import { SlashIDProvider } from "..";
import { STORAGE_GDPR_CONSENT_KEY, useGdprConsent } from "./use-gdpr-consent";

const NO_CONSENTS_TEXT = "No consents";
const TEST_TOKEN = createTestUser().token;

const TestComponent = () => {
  const { consents } = useGdprConsent();

  if (consents.length === 0) {
    return <div>{NO_CONSENTS_TEXT}</div>;
  }

  return (
    <div>
      {consents.map(({ consent_level }) => (
        <div key={consent_level}>{consent_level}</div>
      ))}
    </div>
  );
};

describe("useGdprConsent", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
  const getGDPRConsentSpy = vi.spyOn(User.prototype, "getGDPRConsent");
  const setGDPRConsentSpy = vi.spyOn(User.prototype, "setGDPRConsent");

  afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
    removeItemSpy.mockClear();
    getGDPRConsentSpy.mockClear();
    setGDPRConsentSpy.mockClear();
  });

  test("should return no consents for anonymous user on first visit", async () => {
    render(<TestComponent />);

    expect(getGDPRConsentSpy).not.toHaveBeenCalled();
    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_GDPR_CONSENT_KEY);

    expect(await screen.findByText(NO_CONSENTS_TEXT)).toBeInTheDocument();
  });

  test("should return consents for anonymous user on second visit", async () => {
    const testConsentLevel: GDPRConsentLevel = "necessary";
    const testConsents: GDPRConsent[] = [
      {
        consent_level: testConsentLevel,
        created_at: new Date(),
      },
    ];

    getItemSpy.mockReturnValue(JSON.stringify(testConsents));

    render(<TestComponent />);

    expect(getGDPRConsentSpy).not.toHaveBeenCalled();
    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_GDPR_CONSENT_KEY);

    expect(await screen.findByText(testConsentLevel)).toBeInTheDocument();
    expect(screen.queryByText(NO_CONSENTS_TEXT)).not.toBeInTheDocument();
  });

  test("should return consents for anonymous user after logging in", async () => {
    const testConsentLevel: GDPRConsentLevel = "analytics";
    const testConsents: GDPRConsent[] = [
      {
        consent_level: testConsentLevel,
        created_at: new Date(),
      },
    ];

    getItemSpy.mockReturnValue(JSON.stringify(testConsents));
    getGDPRConsentSpy.mockReturnValue(
      Promise.resolve({
        consents: [],
      })
    );
    setGDPRConsentSpy.mockReturnValue(
      Promise.resolve({
        consents: testConsents,
      })
    );

    render(
      <SlashIDProvider initialToken={TEST_TOKEN} oid={TEST_ORG_ID}>
        <TestComponent />
      </SlashIDProvider>
    );

    expect(getGDPRConsentSpy).toHaveBeenCalled();
    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_GDPR_CONSENT_KEY);

    expect(await screen.findByText(testConsentLevel)).toBeInTheDocument();
    expect(screen.queryByText(NO_CONSENTS_TEXT)).not.toBeInTheDocument();

    expect(setGDPRConsentSpy).toHaveBeenCalledWith({
      consentLevels: [testConsentLevel],
    });
    expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_GDPR_CONSENT_KEY);
  });

  test("should return consents for logged in user on second visit", async () => {
    const testConsentLevel: GDPRConsentLevel = "marketing";
    const testConsents: GDPRConsent[] = [
      {
        consent_level: testConsentLevel,
        created_at: new Date(),
      },
    ];

    getItemSpy.mockReturnValue(null);
    getGDPRConsentSpy.mockReturnValue(
      Promise.resolve({
        consents: testConsents,
      })
    );

    render(
      <SlashIDProvider initialToken={TEST_TOKEN} oid={TEST_ORG_ID}>
        <TestComponent />
      </SlashIDProvider>
    );

    expect(getGDPRConsentSpy).toHaveBeenCalled();
    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_GDPR_CONSENT_KEY);

    expect(await screen.findByText(testConsentLevel)).toBeInTheDocument();
    expect(screen.queryByText(NO_CONSENTS_TEXT)).not.toBeInTheDocument();

    expect(setGDPRConsentSpy).not.toHaveBeenCalled();
    expect(removeItemSpy).not.toHaveBeenCalled();
  });
});
