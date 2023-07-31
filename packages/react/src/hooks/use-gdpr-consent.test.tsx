import { render, screen } from "@testing-library/react";
import { STORAGE_GDPR_CONSENT_KEY, useGdprConsent } from "./use-gdpr-consent";

const TestComponent = () => {
  const { consents } = useGdprConsent();

  if (consents.length === 0) {
    return <div>No consents</div>;
  }

  return (
    <div>
      {consents.map((consent) => (
        <div key={consent.consent_level}>{consent.consent_level}</div>
      ))}
    </div>
  );
};

describe("useGdprConsent", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

  afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
  });

  test("should return no consents for anonymous user on first visit", async () => {
    render(<TestComponent />);

    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_GDPR_CONSENT_KEY);
    expect(await screen.findByText("No consents")).toBeInTheDocument();
  });

  test("should return consents for anonymous user on second visit", async () => {
    const testConsentLevel = "necessary";

    getItemSpy.mockReturnValue(
      JSON.stringify([
        {
          consent_level: testConsentLevel,
          created_at: new Date(),
        },
      ])
    );

    render(<TestComponent />);

    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_GDPR_CONSENT_KEY);
    expect(await screen.findByText(testConsentLevel)).toBeInTheDocument();
    expect(screen.queryByText("No consents")).not.toBeInTheDocument();
  });
});
