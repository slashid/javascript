import { Errors, Factor, PersonHandle, User } from "@slashid/slashid";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe } from "vitest";
import { createTestUser, inputEmail, MockSlashID } from "../test-utils";

import { TestSlashIDProvider } from "../../context/test-providers";
import { DynamicFlow } from ".";
import { ConfigurationProvider } from "../../main";
import { STORAGE_LAST_HANDLE_KEY } from "../../hooks/use-last-handle";
import { TEXT } from "../text/constants";
import { STORAGE_LAST_FACTOR_KEY } from "../../hooks/use-last-factor";

describe("#DynamicFlow", () => {
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

  afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
    setItemSpy.mockClear();
  });

  test("should render in the initial state", () => {
    const logInMock = vi.fn(() => Promise.resolve(createTestUser()));

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "webauthn" }]}>
          <DynamicFlow getFactors={async () => [{ method: "email_link" }]} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(
      screen.getByTestId("sid-dynamic-flow--initial-state")
    ).toBeInTheDocument();
  });

  test("should use the factor from the provided getFactor callback to perform authentication", async () => {
    const logInMock = vi.fn(() => Promise.resolve(createTestUser()));
    const getFactorMock = vi.fn(() => [{ method: "email_link" }] as Factor[]);
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "webauthn" }]}>
          <DynamicFlow getFactors={getFactorMock} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-authenticating-state")
    ).resolves.toBeInTheDocument();

    expect(getFactorMock).toHaveBeenCalledTimes(1);
    expect(getFactorMock).toHaveBeenCalledWith({
      type: "email_address",
      value: "valid@email.com",
    });
    expect(logInMock).toHaveBeenCalledTimes(1);
    expect(logInMock).toHaveBeenCalledWith(
      {
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "valid@email.com" },
      },
      {
        middleware: undefined,
      }
    );
  });

  test("should use the middleware if provided to transform the user object", async () => {
    const TEST_OID = "TEST OID";
    const TEST_USER = createTestUser();
    const TEST_MAPPED_USER = createTestUser({ oid: TEST_OID });
    const logInMock = vi.fn((_, { middleware }) => middleware(TEST_USER));
    const getFactorMock = vi.fn(() => [{ method: "email_link" }] as Factor[]);
    const middlewareMock = vi.fn(() => Promise.resolve(TEST_MAPPED_USER));
    const onSuccessMock = vi.fn();

    const user = userEvent.setup();

    const { unmount } = render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "webauthn" }]}>
          <DynamicFlow
            getFactors={getFactorMock}
            onSuccess={onSuccessMock}
            middleware={middlewareMock}
          />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    await act(() =>
      user.click(screen.getByTestId("sid-form-initial-submit-button"))
    );

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();

    expect(logInMock).toHaveBeenCalledWith(
      {
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "valid@email.com" },
      },
      {
        middleware: middlewareMock,
      }
    );
    expect(middlewareMock).toHaveBeenCalledTimes(1);
    expect(middlewareMock).toHaveBeenCalledWith(TEST_USER);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onSuccessMock).toHaveBeenCalledWith(TEST_MAPPED_USER);

    unmount();
  });

  test("renders divider when both OIDC and non-OIDC factors are present", async () => {
    const factorsMixed = [
      { method: "email_link" as const },
      {
        method: "oidc" as const,
        options: { provider: "github" as const, client_id: "github" },
      },
    ];
    const user = userEvent.setup();
    render(
      <TestSlashIDProvider sdkState="ready">
        <ConfigurationProvider factors={factorsMixed}>
          <DynamicFlow getFactors={() => factorsMixed} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );
    inputEmail("test@email.com");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));
    expect(await screen.findByText("or")).toBeInTheDocument();
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
          <DynamicFlow getFactors={() => [{ method: "email_link" as const }]} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(getItemSpy).toHaveBeenCalledWith(STORAGE_LAST_HANDLE_KEY);
    expect(
      screen.getByPlaceholderText(TEXT["initial.handle.email.placeholder"])
    ).toHaveValue(testEmail);
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
          <DynamicFlow getFactors={() => [{ method: "email_link" as const }]} />
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

  test("should store last factor on successful login", async () => {
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
        <ConfigurationProvider storeLastFactor={true}>
          <DynamicFlow getFactors={() => [{ method: "email_link" as const }]} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail(TEST_HANDLE.value);

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();

    sid.mockPublish("idFlowSucceeded", {
      authenticationFactor: { method: "email_link" },
      token: testUser.token,
    });
    expect(setItemSpy).toHaveBeenCalledWith(
      STORAGE_LAST_FACTOR_KEY("test-oid"),
      JSON.stringify({ method: "email_link" })
    );
  });

  test("calls onError callback on failed login", async () => {
    const logInMock = vi.fn(() => Promise.reject(new Error("login error")));
    const onError = vi.fn();
    const user = userEvent.setup();
    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "email_link" as const }]}>
          <DynamicFlow
            getFactors={() => [{ method: "email_link" as const }]}
            onError={onError}
          />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );
    inputEmail("test@email.com");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));
    expect(
      await screen.findByTestId("sid-form-error-state")
    ).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
  });

  test("calls onSuccess callback on successful login", async () => {
    const testUser = createTestUser();
    const logInMock = vi.fn(async () => testUser);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "email_link" as const }]}>
          <DynamicFlow
            getFactors={() => [{ method: "email_link" as const }]}
            onSuccess={onSuccess}
          />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );
    inputEmail("test@email.com");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));
    expect(
      await screen.findByTestId("sid-form-success-state")
    ).toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledWith(testUser);
  });

  test("attempts SSO with the hook factor before resolving factors", async () => {
    const logInMock = vi.fn(() => new Promise<User | undefined>(() => {}));
    const getFactors = vi.fn(() => [{ method: "email_link" }] as Factor[]);
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "email_link" }]}>
          <DynamicFlow attemptSSO getFactors={getFactors} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-authenticating-state")
    ).resolves.toBeInTheDocument();
    expect(getFactors).not.toHaveBeenCalled();
    expect(logInMock).toHaveBeenCalledTimes(1);
    expect(logInMock).toHaveBeenCalledWith(
      {
        factor: { method: "hook" },
        handle: { type: "email_address", value: "user@acme.test" },
      },
      { middleware: undefined }
    );
  });

  const hookUnresolved = () =>
    Errors.createSlashIDError({
      name: Errors.ERROR_NAMES.hookFactorUnresolved,
      message: "unresolved",
    });

  test("resolves factors with the same handle when the SSO attempt is unresolved", async () => {
    const logInMock = vi.fn(
      (): Promise<User | undefined> => Promise.reject(hookUnresolved())
    );
    const getFactors = vi.fn(
      () => [{ method: "email_link" }, { method: "password" }] as Factor[]
    );
    const onError = vi.fn();
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "email_link" }]}>
          <DynamicFlow attemptSSO onError={onError} getFactors={getFactors} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-dynamic-flow--resolved-factors")
    ).resolves.toBeInTheDocument();
    expect(logInMock).toHaveBeenCalledTimes(1);
    expect(getFactors).toHaveBeenCalledWith({
      type: "email_address",
      value: "user@acme.test",
    });
    expect(onError).not.toHaveBeenCalled();
    expect(screen.queryByTestId("sid-form-error-state")).not.toBeInTheDocument();

    // the picker submits with the handle from the first step
    logInMock.mockImplementation(() => Promise.resolve(createTestUser()));
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));
    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
    expect(logInMock).toHaveBeenLastCalledWith(
      {
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "user@acme.test" },
      },
      { middleware: undefined }
    );
  });

  test("the picker's back button returns to the identifier step", async () => {
    const logInMock = vi.fn(() => Promise.reject(hookUnresolved()));
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "email_link" }]}>
          <DynamicFlow
            attemptSSO
            getFactors={() => [{ method: "email_link" }, { method: "password" }]}
          />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));
    await screen.findByTestId("sid-dynamic-flow--resolved-factors");

    await user.click(screen.getByTestId("sid-form-authenticating-cancel-button"));
    expect(
      screen.getByPlaceholderText(TEXT["initial.handle.email.placeholder"])
    ).toBeInTheDocument();
  });

  test("submits a single resolved factor directly when the SSO attempt is unresolved", async () => {
    const testUser = createTestUser();
    const logInMock = vi
      .fn()
      .mockImplementationOnce(() => Promise.reject(hookUnresolved()))
      .mockImplementationOnce(() => Promise.resolve(testUser));
    const onSuccess = vi.fn();
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "email_link" }]}>
          <DynamicFlow
            attemptSSO
            onSuccess={onSuccess}
            getFactors={() => [{ method: "email_link" }]}
          />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
    expect(logInMock).toHaveBeenCalledTimes(2);
    expect(logInMock).toHaveBeenNthCalledWith(
      2,
      {
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "user@acme.test" },
      },
      { middleware: undefined }
    );
    expect(onSuccess).toHaveBeenCalledWith(testUser);
  });

  test("still reports other errors of an SSO attempt", async () => {
    const logInMock = vi.fn(() => Promise.reject(new Error("idp down")));
    const onError = vi.fn();
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "email_link" }]}>
          <DynamicFlow
            attemptSSO
            onError={onError}
            getFactors={() => [{ method: "email_link" }]}
          />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  test("shows the resolved SSO factor and succeeds with the manager-org user", async () => {
    const sid = new MockSlashID({ oid: "dashboard-oid" });
    const managerUser = createTestUser({ oid: "manager-oid" });
    const logInMock = vi.fn(async () => {
      sid.mockPublish("authnContextUpdateChallengeReceivedEvent", {
        targetOrgId: "dashboard-oid",
        factor: {
          method: "saml",
          options: { method: "saml", provider_credentials_id: "creds" },
        },
      });
      return managerUser;
    });
    const onSuccess = vi.fn();
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock} sid={sid}>
        <ConfigurationProvider factors={[{ method: "email_link" }]}>
          <DynamicFlow
            attemptSSO
            onSuccess={onSuccess}
            getFactors={() => [{ method: "email_link" }]}
          />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
    expect(onSuccess).toHaveBeenCalledWith(managerUser);
  });

  test("resets to the identifier step when the resolved SSO login is refused", async () => {
    const refused = Errors.createSlashIDError({
      name: Errors.ERROR_NAMES.selfRegistrationNotAllowed,
      message: "self-registration not allowed for this organization",
    });
    const logInMock = vi.fn(() => Promise.reject(refused));
    const getFactors = vi.fn(
      () => [{ method: "email_link" }, { method: "password" }] as Factor[]
    );
    const onError = vi.fn();
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "email_link" }]}>
          <DynamicFlow attemptSSO onError={onError} getFactors={getFactors} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("user@acme.test");
    await user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await user.click(await screen.findByTestId("sid-form-error-retry-button"));
    await expect(
      screen.findByTestId("sid-form-initial-submit-button")
    ).resolves.toBeInTheDocument();
    expect(getFactors).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId("sid-dynamic-flow--resolved-factors")
    ).not.toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
