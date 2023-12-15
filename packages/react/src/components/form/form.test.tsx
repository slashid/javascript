import { PersonHandle, User } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, afterEach } from "vitest";
import { Form } from ".";
import { TEXT } from "../text/constants";
import { STORAGE_LAST_HANDLE_KEY } from "../../hooks/use-last-handle";
import { createTestUser, inputEmail, MockSlashID } from "../test-utils";

import { TestSlashIDProvider } from "../../context/test-providers";
import { ConfigurationProvider } from "../../context/config-context";

describe("#Form", () => {
  test("should render in the initial state", () => {
    const logInMock = vi.fn(async () => createTestUser());

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-form-initial-state")).toBeInTheDocument();
  });

  test("should not render divider when only non-OIDC factors are present", () => {
    const logInMock = vi.fn(async () => createTestUser());
    const factors = [{ method: "email_link" }, { method: "webauthn" }];
    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider
          // @ts-expect-error
          factors={factors}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-form-initial-state")).toBeInTheDocument();

    expect(screen.queryByText(TEXT["initial.divider"])).not.toBeInTheDocument();
  });

  test("should not render divider when only OIDC factors are present", () => {
    const logInMock = vi.fn(async () => createTestUser());
    const factors = [
      {
        method: "oidc",
        options: { provider: "facebook", client_id: "facebook" },
      },
      { method: "oidc", options: { provider: "github", client_id: "github" } },
    ];
    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider
          // @ts-expect-error
          factors={factors}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-form-initial-state")).toBeInTheDocument();

    expect(screen.queryByText(TEXT["initial.divider"])).not.toBeInTheDocument();
  });

  test("should render divider when both OIDC and non OIDC factors are present", () => {
    const logInMock = vi.fn(async () => createTestUser());
    const factors = [
      { method: "email_link" },
      { method: "webauthn" },
      {
        method: "oidc",
        options: { provider: "facebook", client_id: "facebook" },
      },
      { method: "oidc", options: { provider: "github", client_id: "github" } },
    ];
    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider
          // @ts-expect-error
          factors={factors}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-form-initial-state")).toBeInTheDocument();

    expect(screen.queryByText(TEXT["initial.divider"])).toBeInTheDocument();
  });

  test("should render error message - empty email input", async () => {
    const logInMock = vi.fn(async () => createTestUser());
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-error-message")
    ).resolves.toBeInTheDocument();
  });

  test("should render error message - invalid email input", async () => {
    const logInMock = vi.fn(async () => createTestUser());
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    inputEmail("invalid-email");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-error-message")
    ).resolves.toBeInTheDocument();
  });

  test("should clear error message after changing input value", async () => {
    const logInMock = vi.fn(async () => createTestUser());
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-error-message")
    ).resolves.toBeInTheDocument();

    inputEmail("valid@email.com");

    expect(
      screen.queryByTestId("sid-form-error-message")
    ).not.toBeInTheDocument();
  });

  test("should transition from initial to authenticating state", async () => {
    const logInMock = vi.fn(async () => createTestUser());
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-authenticating-state")
    ).resolves.toBeInTheDocument();
  });

  test("should transition from authenticating to initial state on the back button click", async () => {
    // used to store the resolve callback
    let r: undefined | ((u: User) => void);
    const logInMock = vi.fn(
      () =>
        new Promise<User>((resolve) => {
          // keep a reference to resolve so we can resolve the promise to prevent memory leaks after the test is done
          r = resolve;
        })
    );
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));
    const cancelButton = await screen.findByTestId(
      "sid-form-authenticating-cancel-button"
    );
    user.click(cancelButton);

    await expect(
      screen.findByTestId("sid-form-initial-state")
    ).resolves.toBeInTheDocument();

    // resolve the promise to prevent memory leak
    if (typeof r === "function") {
      r(createTestUser());
    }
  });

  test("should show the success state on successful login", async () => {
    const logInMock = vi.fn(async () => createTestUser());
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
  });

  test("should call the onSuccess callback if provided on a successful login", async () => {
    const testUser = createTestUser();
    const logInMock = vi.fn(async () => testUser);
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form onSuccess={onSuccess} />
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();

    expect(onSuccess).toBeCalledTimes(1);
    expect(onSuccess).toBeCalledWith(testUser);
  });

  test("should show the error state if login fails", async () => {
    const logInMock = vi.fn(() => Promise.reject("login error"));
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(logInMock).rejects.toMatch("login error");
    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();
  });

  test("should allow going back to the initial state if login fails", async () => {
    const logInMock = vi.fn(() => Promise.reject("login error"));
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(logInMock).rejects.toMatch("login error");
    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();

    const cancelButton = await screen.findByTestId(
      "sid-form-authenticating-cancel-button"
    );
    user.click(cancelButton);

    await expect(
      screen.findByTestId("sid-form-initial-state")
    ).resolves.toBeInTheDocument();
  });

  test("should allow a retry if login fails", async () => {
    let loginShouldSucceed = false;
    const logInMock = vi.fn(() => {
      if (!loginShouldSucceed) return Promise.reject("login error");
      return Promise.resolve(createTestUser());
    });
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(logInMock).rejects.toMatch("login error");
    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();

    const retryButton = await screen.findByTestId(
      "sid-form-error-retry-button"
    );

    loginShouldSucceed = true;
    user.click(retryButton);

    await expect(
      screen.findByTestId("sid-form-authenticating-state")
    ).resolves.toBeInTheDocument();

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
  });
});

describe("<Form /> configuration", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

  afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
  });

  test("should use stored email address", async () => {
    const testEmail = "test@email.com";

    getItemSpy.mockReturnValueOnce(
      JSON.stringify({
        type: "email_address",
        value: testEmail,
      })
    );

    render(
      <TestSlashIDProvider sdkState="ready">
        <ConfigurationProvider storeLastHandle={true}>
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-form-initial-state")).toBeInTheDocument();

    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_LAST_HANDLE_KEY);
    expect(
      screen.getByPlaceholderText(TEXT["initial.handle.phone.email"])
    ).toHaveValue(testEmail);
  });

  test("should use stored phone number", async () => {
    const dialCode = "+48";
    const phoneNumber = "123123123";
    const testPhoneNumber = dialCode + phoneNumber;

    getItemSpy.mockReturnValueOnce(
      JSON.stringify({
        type: "phone_number",
        value: testPhoneNumber,
      })
    );

    render(
      <TestSlashIDProvider sdkState="ready">
        <ConfigurationProvider
          storeLastHandle={true}
          factors={[{ method: "email_link" }, { method: "otp_via_sms" }]}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-form-initial-state")).toBeInTheDocument();

    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_LAST_HANDLE_KEY);
    expect(
      screen.getByPlaceholderText(TEXT["initial.handle.phone.placeholder"])
    ).toHaveValue(phoneNumber);
  });

  test("should store last handle on successful login", async () => {
    const TEST_HANDLE: PersonHandle = {
      type: "email_address",
      value: "test@email.com",
    };
    const sid = new MockSlashID({ oid: "test-oid" });
    const user = userEvent.setup();
    const testUser = createTestUser();
    const logInMock = vi.fn(async () => testUser);

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock} sid={sid}>
        <ConfigurationProvider storeLastHandle={true}>
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail(TEST_HANDLE.value);

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

  test("show banner - default", () => {
    render(
      <TestSlashIDProvider sdkState="ready">
        <ConfigurationProvider
          factors={[{ method: "email_link" }, { method: "otp_via_sms" }]}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(screen.getByText(TEXT["footer.branding"])).toBeInTheDocument();
  });

  test("hide banner", () => {
    render(
      <TestSlashIDProvider sdkState="ready">
        <ConfigurationProvider
          factors={[{ method: "email_link" }, { method: "otp_via_sms" }]}
          showBanner={false}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(screen.queryByText(TEXT["footer.branding"])).not.toBeInTheDocument();
  });
});
