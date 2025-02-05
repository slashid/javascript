import { render, waitFor } from "@testing-library/react";
import { Form, SlashIDProvider } from "../main";
import { createTestUser, TEST_ORG_ID } from "../components/test-utils";
import {
  LEGACY_STORAGE_TOKEN_KEY,
  STORAGE_TOKEN_KEY,
} from "../context/slash-id-context";

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
});
