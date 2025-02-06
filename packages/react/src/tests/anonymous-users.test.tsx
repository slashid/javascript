import type { PropsWithChildren } from "react";
import { describe, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSlashID, SlashIDProvider } from "../main";
import { createAnonymousTestUser } from "../components/test-utils";
import { SlashID } from "@slashid/slashid";
import { STORAGE_TOKEN_KEY } from "../context/slash-id-context";

describe("Anonymous users", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be created when anonymousUsersEnabled is true", async () => {
    const TEST_ROOT_OID = "oid_1";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper = ({ children }: PropsWithChildren<any>) => (
      <SlashIDProvider oid={TEST_ROOT_OID} anonymousUsersEnabled>
        {children}
      </SlashIDProvider>
    );
    const { result, unmount } = renderHook(() => useSlashID(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.sdkState).toBe("ready"));

    expect(result.current.user).not.toBeDefined();
    expect(result.current.anonymousUser).toBeDefined();
    expect(result.current.anonymousUser?.anonymous).toBe(true);

    unmount();
  });

  it("should not be created when anonymousUsersEnabled is false", async () => {
    const TEST_ROOT_OID = "oid_1";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper = ({ children }: PropsWithChildren<any>) => (
      <SlashIDProvider oid={TEST_ROOT_OID} anonymousUsersEnabled={false}>
        {children}
      </SlashIDProvider>
    );
    const { result, unmount } = renderHook(() => useSlashID(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.sdkState).toBe("ready"));

    expect(result.current.user).toBeUndefined();
    expect(result.current.anonymousUser).toBeUndefined();

    unmount();
  });

  it("should be loaded from localStorage", async () => {
    const TEST_ROOT_OID = "oid_1";

    const anonUser = createAnonymousTestUser({ oid: TEST_ROOT_OID });
    localStorage.setItem(STORAGE_TOKEN_KEY(TEST_ROOT_OID), anonUser.token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper = ({ children }: PropsWithChildren<any>) => (
      <SlashIDProvider oid={TEST_ROOT_OID} anonymousUsersEnabled>
        {children}
      </SlashIDProvider>
    );
    const { result, unmount } = renderHook(() => useSlashID(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.sdkState).toBe("ready"));

    expect(result.current.user).not.toBeDefined();
    expect(result.current.anonymousUser).toBeDefined();
    expect(result.current.anonymousUser?.ID).toBe(anonUser.ID);

    unmount();
    localStorage.clear();
  });

  it("should be loaded from initialToken", async () => {
    const TEST_ROOT_OID = "oid_1";

    const anonUser = createAnonymousTestUser({ oid: TEST_ROOT_OID });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper = ({ children }: PropsWithChildren<any>) => (
      <SlashIDProvider
        oid={TEST_ROOT_OID}
        anonymousUsersEnabled
        initialToken={anonUser.token}
      >
        {children}
      </SlashIDProvider>
    );
    const { result, unmount } = renderHook(() => useSlashID(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.sdkState).toBe("ready"));

    expect(result.current.user).not.toBeDefined();
    expect(result.current.anonymousUser).toBeDefined();
    expect(result.current.anonymousUser?.ID).toBe(anonUser.ID);

    unmount();
  });

  it("should be loaded from direct id", async () => {
    const TEST_ROOT_OID = "oid_1";

    const anonUser = createAnonymousTestUser({ oid: TEST_ROOT_OID });

    SlashID.prototype.getUserFromURL = vi
      .fn(SlashID.prototype.getUserFromURL)
      .mockResolvedValue(anonUser);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapper = ({ children }: PropsWithChildren<any>) => (
      <SlashIDProvider oid={TEST_ROOT_OID} anonymousUsersEnabled>
        {children}
      </SlashIDProvider>
    );
    const { result, unmount } = renderHook(() => useSlashID(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.sdkState).toBe("ready"));

    expect(result.current.user).not.toBeDefined();
    expect(result.current.anonymousUser).toBeDefined();
    expect(result.current.anonymousUser?.ID).toBe(anonUser.ID);

    unmount();
  });
});
