import type { PropsWithChildren } from "react";
import { describe, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSlashID, SlashIDProvider } from "../main";

describe("Log in / Log out flow", () => {
  it("should log in correctly after logging out", async () => {
    const TEST_ROOT_OID = "oid_1";
    const wrapper = ({ children }: PropsWithChildren<any>) => (
      <SlashIDProvider oid={TEST_ROOT_OID}>{children}</SlashIDProvider>
    );

    const { result, rerender } = renderHook(() => useSlashID(), { wrapper });

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
    rerender();
    expect(result.current.user).toEqual(user);

    result.current.logOut();
    rerender();
    expect(result.current.user).toBeUndefined();

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
    rerender();
    expect(result.current.user).toEqual(newUser);
  });
});
