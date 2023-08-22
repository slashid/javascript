import type { PropsWithChildren } from "react";
import { describe, it } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useSlashID, SlashIDProvider } from "../main";

describe("Log in / Log out flow", () => {
  it("should log in correctly after logging out", async () => {
    const TEST_ROOT_OID = "oid_1";
    const wrapper = ({ children }: PropsWithChildren<any>) => (
      <SlashIDProvider oid={TEST_ROOT_OID}>{children}</SlashIDProvider>
    );

    const { result, unmount } = renderHook(() => useSlashID(), {
      wrapper,
    });
    await act(
      () =>
        async function () {
          const user = await result.current.logIn({
            factor: {
              method: "email_link",
            },
            handle: {
              type: "email_address",
              value: "test@example.com",
            },
          });
          expect(user?.token).toBeDefined();
          await waitFor(() => expect(result.current.user).toEqual(user));
        }
    );

    result.current.logOut();
    await waitFor(() => expect(result.current.user).toBeUndefined());

    await act(
      () =>
        async function () {
          const newUser = await result.current.logIn({
            factor: {
              method: "email_link",
            },
            handle: {
              type: "email_address",
              value: "test2@example.com",
            },
          });

          expect(newUser?.token).toBeDefined();
          await waitFor(() => expect(result.current.user).toEqual(newUser));
        }
    );
    unmount();
  });

  it("should have root oid after org switching and logOut", async () => {
    const TEST_ROOT_OID = "oid_1";
    const wrapper = ({ children }: PropsWithChildren<any>) => (
      <SlashIDProvider oid={TEST_ROOT_OID}>{children}</SlashIDProvider>
    );

    const { result, unmount } = renderHook(() => useSlashID(), { wrapper });

    await act(
      () =>
        async function () {
          const user = await result.current.logIn({
            factor: {
              method: "email_link",
            },
            handle: {
              type: "email_address",
              value: "test@example.com",
            },
          });
          expect(user?.token).toBeDefined();
          await waitFor(() => expect(result.current.user).toEqual(user));
        }
    );

    await act(
      () =>
        async function () {
          await result.current.__switchOrganizationInContext({
            oid: "other_oid",
          });

          await waitFor(() =>
            expect(result.current.user?.oid).toEqual("other_oid")
          );
        }
    );

    result.current.logOut();
    await waitFor(() => expect(result.current.user).toBeUndefined());

    await act(
      () =>
        async function () {
          const newUser = await result.current.logIn({
            factor: {
              method: "email_link",
            },
            handle: {
              type: "email_address",
              value: "test2@example.com",
            },
          });

          expect(newUser?.token).toBeDefined();
          await waitFor(() => expect(newUser?.oid).toEqual(TEST_ROOT_OID));
        }
    );
    unmount();
  });
});
