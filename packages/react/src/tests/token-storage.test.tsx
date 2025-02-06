import { render, waitFor, screen } from "@testing-library/react";
import {
  Form,
  LoggedIn,
  LoggedOut,
  SlashIDProvider,
  useSlashID,
} from "../main";
import { createTestUser, TEST_ORG_ID } from "../components/test-utils";
import {
  LEGACY_STORAGE_TOKEN_KEY,
  STORAGE_TOKEN_KEY,
} from "../context/slash-id-context";
import userEvent from "@testing-library/user-event";

describe("token storage key with org id suffix", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
  const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");

  afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
    setItemSpy.mockClear();
    removeItemSpy.mockClear();
  });

  it("should use the token from localStorage", async () => {
    const testUser = createTestUser({ oid: TEST_ORG_ID });
    localStorage.setItem(STORAGE_TOKEN_KEY(TEST_ORG_ID), testUser.token);

    render(
      <SlashIDProvider
        oid={TEST_ORG_ID}
        tokenStorage="localStorage"
        analyticsEnabled={false}
      >
        <Form />
      </SlashIDProvider>
    );

    await waitFor(() =>
      expect(getItemSpy).toHaveBeenCalledWith(STORAGE_TOKEN_KEY(TEST_ORG_ID))
    );
  });

  it("should replace legacy token key with new one", async () => {
    const testUser = createTestUser({ oid: TEST_ORG_ID });
    localStorage.setItem(LEGACY_STORAGE_TOKEN_KEY, testUser.token);

    render(
      <SlashIDProvider
        oid={TEST_ORG_ID}
        tokenStorage="localStorage"
        analyticsEnabled={false}
      >
        <Form />
      </SlashIDProvider>
    );

    await waitFor(() =>
      expect(getItemSpy).toHaveBeenCalledWith(LEGACY_STORAGE_TOKEN_KEY)
    );

    await waitFor(() =>
      expect(setItemSpy).toHaveBeenCalledWith(
        STORAGE_TOKEN_KEY(TEST_ORG_ID),
        testUser.token
      )
    );

    await waitFor(() =>
      expect(removeItemSpy).toHaveBeenCalledWith(LEGACY_STORAGE_TOKEN_KEY)
    );
  });

  it("should remove all user tokens on log out", async () => {
    const oid1 = "40123378-47ea-43d9-b7b2-aaa05bea48dc";
    const oid2 = "67a5710c-b9f6-4640-9dbc-7b1c5fad4435";
    const oid3 = "834e6c25-bca7-40b5-81ff-8cb7b4680c9b";

    const user1 = createTestUser({ oid: oid1 });
    const user2 = createTestUser({ oid: oid2 });
    const user3 = createTestUser({ oid: oid3 });

    localStorage.setItem(STORAGE_TOKEN_KEY(oid1), user1.token);
    localStorage.setItem(STORAGE_TOKEN_KEY(oid2), user2.token);
    localStorage.setItem(STORAGE_TOKEN_KEY(oid3), user3.token);

    const browserUser = userEvent.setup();

    const TestComponent = () => {
      const { logOut, user } = useSlashID();

      return (
        <>
          {user && <div data-testid="logged-in">logged in</div>}
          <button data-testid="logout" onClick={logOut}>
            log out
          </button>
        </>
      );
    };

    render(
      <SlashIDProvider
        oid={oid1}
        tokenStorage="localStorage"
        analyticsEnabled={false}
      >
        <LoggedOut>
          <Form />
        </LoggedOut>
        <LoggedIn>
          <TestComponent />
        </LoggedIn>
      </SlashIDProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("logged-in")).toBeInTheDocument()
    );

    browserUser.click(screen.getByTestId("logout"));

    await waitFor(() =>
      expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_TOKEN_KEY(oid1))
    );
    await waitFor(() =>
      expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_TOKEN_KEY(oid2))
    );
    await waitFor(() =>
      expect(removeItemSpy).toHaveBeenCalledWith(STORAGE_TOKEN_KEY(oid3))
    );
  });
});
