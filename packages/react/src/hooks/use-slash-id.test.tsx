import { act, render, screen } from "@testing-library/react";
import { SlashIDProvider } from "../main";
import { useSlashID } from "./use-slash-id";
import {
  TEST_ORG_ID,
  TEST_PERSON_ID,
  createTestUser,
} from "../components/test-utils";
import { BASE_API_URL_CUSTOM } from "../mocks/handlers";

const TestComponent = () => {
  const { user } = useSlashID();

  if (!user) {
    return <div>Not logged in</div>;
  }

  return <div>{user.ID}</div>;
};

const TestEnvironmentComponent = () => {
  const { sid } = useSlashID();

  if (!sid) return null;

  return (
    <>
      <p>{sid.baseURL}</p>
      <p>{sid.sdkURL}</p>
    </>
  );
};

describe("useSlashID", () => {
  test("should return a user instance when a valid initial token is passed to the SlashIDProvider", async () => {
    render(
      <SlashIDProvider initialToken={createTestUser().token} oid={TEST_ORG_ID}>
        <TestComponent />
      </SlashIDProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(TEST_PERSON_ID)
    ).resolves.toBeInTheDocument();
  });

  test("should use proper custom environment", async () => {
    const customEnv = {
      baseURL: BASE_API_URL_CUSTOM,
      sdkURL: "https://custom.sdk.url",
    };

    await act(() =>
      render(
        <SlashIDProvider environment={customEnv} oid={TEST_ORG_ID}>
          <TestEnvironmentComponent />
        </SlashIDProvider>
      )
    );

    expect.assertions(2);
    await expect(
      screen.findByText(customEnv.baseURL)
    ).resolves.toBeInTheDocument();
    await expect(
      screen.findByText(customEnv.sdkURL)
    ).resolves.toBeInTheDocument();
  });

  test("should throw en error when you pass both `environment` and deprecated URLs props", async () => {
    const customEnv = {
      baseURL: "https://custom.base.url",
      sdkURL: "https://custom.sdk.url",
    };

    // prevent noise in the output
    vi.spyOn(console, "error").mockImplementation(() => null);

    expect(() =>
      render(
        <SlashIDProvider
          environment={customEnv}
          baseApiUrl="test"
          sdkUrl="test"
          oid={TEST_ORG_ID}
        >
          <TestEnvironmentComponent />
        </SlashIDProvider>
      )
    ).toThrow();
  });
});
