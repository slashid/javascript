import { Factor } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe } from "vitest";
import { createTestUser, inputEmail } from "../test-utils";

import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { DynamicFlow } from ".";
import { ConfigurationProvider } from "../..";

describe("#DynamicFlow", () => {
  test("should render in the initial state", () => {
    const logInMock = vi.fn(() => Promise.resolve(createTestUser()));

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "webauthn" }]}>
          <DynamicFlow getFactor={() => ({ method: "email_link" })} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    expect(
      screen.getByTestId("sid-dynamic-flow--initial-state")
    ).toBeInTheDocument();
  });

  test("should use the factor from the provided getFactor callback to perform authentication", async () => {
    const logInMock = vi.fn(() => Promise.resolve(createTestUser()));
    const getFactorMock = vi.fn(() => ({ method: "email_link" } as Factor));
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "webauthn" }]}>
          <DynamicFlow getFactor={getFactorMock} />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-authenticating-state")
    ).resolves.toBeInTheDocument();

    expect(getFactorMock).toBeCalledTimes(1);
    expect(getFactorMock).toHaveBeenCalledWith({
      type: "email_address",
      value: "valid@email.com",
    });
    expect(logInMock).toBeCalledTimes(1);
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
    const getFactorMock = vi.fn(() => ({ method: "email_link" } as Factor));
    const middlewareMock = vi.fn(() => Promise.resolve(TEST_MAPPED_USER));
    const onSuccessMock = vi.fn();

    const user = userEvent.setup();

    const { unmount } = render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "webauthn" }]}>
          <DynamicFlow
            getFactor={getFactorMock}
            onSuccess={onSuccessMock}
            middleware={middlewareMock}
          />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

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
    expect(middlewareMock).toBeCalledTimes(1);
    expect(middlewareMock).toHaveBeenCalledWith(TEST_USER);
    expect(onSuccessMock).toBeCalledTimes(1);
    expect(onSuccessMock).toHaveBeenCalledWith(TEST_MAPPED_USER);

    unmount();
  });
});
