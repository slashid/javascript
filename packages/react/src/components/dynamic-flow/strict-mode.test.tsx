import { StrictMode } from "react";
import { Errors, Factor, User } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { DynamicFlow } from ".";
import { ConfigurationProvider } from "../../main";
import { TestSlashIDProvider } from "../../context/test-providers";
import { createTestUser, inputEmail, MockSlashID } from "../test-utils";

const hookUnresolved = () =>
  Errors.createSlashIDError({
    name: Errors.ERROR_NAMES.hookFactorUnresolved,
    message: "unresolved",
  });

/**
 * StrictMode double-invokes effects, which is where a synchronous submit can
 * fire twice. getFactors is deliberately not asserted on: React calls that
 * effect twice in development and the in-flight result is discarded.
 */
describe("under StrictMode", () => {
  test("an unresolved SSO attempt still reaches the picker exactly once", async () => {
    const logInMock = vi.fn(
      (): Promise<User | undefined> => Promise.reject(hookUnresolved())
    );
    const getFactors = vi.fn(
      () => [{ method: "email_link" }, { method: "password" }] as Factor[]
    );
    const user = userEvent.setup();

    render(
      <StrictMode>
        <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
          <ConfigurationProvider factors={[{ method: "email_link" }]}>
            <DynamicFlow attemptSSO getFactors={getFactors} />
          </ConfigurationProvider>
        </TestSlashIDProvider>
      </StrictMode>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-dynamic-flow--resolved-factors")
    ).resolves.toBeInTheDocument();
    expect(logInMock).toHaveBeenCalledTimes(1);
    expect(logInMock).toHaveBeenCalledWith(
      {
        factor: { method: "hook" },
        handle: { type: "email_address", value: "user@acme.test" },
      },
      { middleware: undefined }
    );
  });

  test("an empty getFactors result renders the no-method screen once", async () => {
    const logInMock = vi.fn(
      (): Promise<User | undefined> => Promise.reject(hookUnresolved())
    );
    const user = userEvent.setup();

    render(
      <StrictMode>
        <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
          <ConfigurationProvider factors={[{ method: "email_link" }]}>
            <DynamicFlow attemptSSO getFactors={() => []} />
          </ConfigurationProvider>
        </TestSlashIDProvider>
      </StrictMode>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    const failed = await screen.findAllByTestId("sid-dynamic-flow--failed");
    expect(failed).toHaveLength(1);
  });

  test("a resolved SSO attempt renders the authenticating step", async () => {
    const sid = new MockSlashID({ oid: "oid", analyticsEnabled: false });
    const logInMock = vi.fn((): Promise<User | undefined> => {
      sid.mockPublish("authnContextUpdateChallengeReceivedEvent", {
        targetOrgId: "oid",
        factor: { method: "email_link" },
      });
      return new Promise(() => {});
    });
    const user = userEvent.setup();

    render(
      <StrictMode>
        <TestSlashIDProvider sdkState="ready" logIn={logInMock} sid={sid}>
          <ConfigurationProvider factors={[{ method: "email_link" }]}>
            <DynamicFlow attemptSSO getFactors={() => []} />
          </ConfigurationProvider>
        </TestSlashIDProvider>
      </StrictMode>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByText(/user@acme.test/)
    ).resolves.toBeInTheDocument();
    expect(logInMock).toHaveBeenCalledTimes(1);
  });

  test("a plain login succeeds without a duplicate submit", async () => {
    const testUser = createTestUser();
    const logInMock = vi.fn(() => Promise.resolve(testUser));
    const user = userEvent.setup();

    render(
      <StrictMode>
        <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
          <ConfigurationProvider factors={[{ method: "email_link" }]}>
            <DynamicFlow getFactors={() => [{ method: "email_link" }]} />
          </ConfigurationProvider>
        </TestSlashIDProvider>
      </StrictMode>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
    expect(logInMock).toHaveBeenCalledTimes(1);
  });
});
