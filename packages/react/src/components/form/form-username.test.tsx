import { PersonHandle } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, afterEach } from "vitest";
import { Form } from ".";
import { TEXT } from "../text/constants";
import { STORAGE_LAST_HANDLE_KEY } from "../../hooks/use-last-handle";
import { createTestUser, inputUsername, MockSlashID } from "../test-utils";

import { TestSlashIDProvider } from "../../context/test-providers";
import { ConfigurationProvider } from "../../context/config-context";
import { FactorConfiguration } from "../../domain/types";

describe("#Form - username handle type", () => {
  test("username tab should not render unless explicitly configured using allowedHandleTypes", () => {
    const logInMock = vi.fn(async () => createTestUser());
    const factors: FactorConfiguration[] = [
      { method: "email_link" },
      { method: "password" },
    ];

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={factors}>
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(
      screen.queryByTestId("sid-tabs-trigger-username")
    ).not.toBeInTheDocument();
  });

  test("username tab should not render unless explicitly configured using allowedHandleTypes", () => {
    const logInMock = vi.fn(async () => createTestUser());
    const factors: FactorConfiguration[] = [
      { method: "email_link" },
      { method: "password", allowedHandleTypes: ["email_address", "username"] },
    ];

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={factors}>
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-tabs-trigger-username")).toBeInTheDocument();
  });

  test("should render error message - invalid username input", async () => {
    const logInMock = vi.fn(async () => createTestUser());
    const user = userEvent.setup();
    const factors: FactorConfiguration[] = [
      { method: "email_link" },
      { method: "password", allowedHandleTypes: ["email_address", "username"] },
    ];

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={factors}>
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-error-message")
    ).resolves.toBeInTheDocument();
  });
});

describe("<Form /> - username side effects", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

  afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
  });

  test("should use stored username", async () => {
    const testUsername = "testUsername";
    const factors: FactorConfiguration[] = [
      { method: "password", allowedHandleTypes: ["username"] },
    ];

    getItemSpy.mockReturnValueOnce(
      JSON.stringify({
        type: "username",
        value: testUsername,
      })
    );

    render(
      <TestSlashIDProvider sdkState="ready">
        <ConfigurationProvider storeLastHandle={true} factors={factors}>
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-form-initial-state")).toBeInTheDocument();

    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_LAST_HANDLE_KEY);
    expect(
      screen.getByPlaceholderText(TEXT["initial.handle.username.placeholder"])
    ).toHaveValue(testUsername);
  });

  test("should store username on successful login", async () => {
    const TEST_HANDLE: PersonHandle = {
      type: "username",
      value: "testUsername",
    };
    const sid = new MockSlashID({ oid: "test-oid" });
    const user = userEvent.setup();
    const testUser = createTestUser();
    const logInMock = vi.fn(async () => testUser);
    const factors: FactorConfiguration[] = [
      { method: "password", allowedHandleTypes: ["username"] },
    ];

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock} sid={sid}>
        <ConfigurationProvider storeLastHandle={true} factors={factors}>
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputUsername(TEST_HANDLE.value);

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();

    sid.mockPublish("idFlowSucceeded", {
      handle: TEST_HANDLE,
      token: testUser.token,
    });
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_LAST_HANDLE_KEY,
      JSON.stringify(TEST_HANDLE)
    );
  });
});
