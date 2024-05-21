import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  TestSlashIDProvider,
  TestTextProvider,
} from "../../../context/test-providers";
import { Form } from "../form";
import Deferred, {
  MockSlashID,
  createTestUser,
  inputEmail,
  inputUsername,
} from "../../test-utils";
import { ConfigurationProvider } from "../../../main";
import { Errors, User } from "@slashid/slashid";
import { TEXT } from "../../text/constants";

describe("#Form -> Error state", () => {
  test("should show the error state if login fails", async () => {
    const logInMock = vi.fn(() => Promise.reject("login error"));
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <TestTextProvider text={TEXT}>
          <Form />
        </TestTextProvider>
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
        <TestTextProvider text={TEXT}>
          <Form />
        </TestTextProvider>
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
        <TestTextProvider text={TEXT}>
          <Form />
        </TestTextProvider>
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

describe("#Form -> Error state -> Contact support", () => {
  test("should not show the contact support CTA if the supportURL is not set", async () => {
    const logInMock = vi.fn(() => Promise.reject("login error"));
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider supportURL={undefined}>
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(logInMock).rejects.toMatch("login error");
    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();
    expect(
      screen.queryByTestId("sid-form-error-contact-support")
    ).not.toBeInTheDocument();
  });

  test("should show the contact support CTA if the supportURL is a valid URL", async () => {
    const logInMock = vi.fn(() => Promise.reject("login error"));
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider supportURL="https://www.test.com">
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(logInMock).rejects.toMatch("login error");
    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();
    expect(
      screen.getByTestId("sid-form-error-support-prompt")
    ).toBeInTheDocument();
  });
});

describe("#Form -> Error state -> Special error cases", () => {
  test("should render the noPasswordSet error state", async () => {
    const logInMock = vi.fn(() =>
      Promise.reject(
        new Errors.SlashIDError({
          name: Errors.ERROR_NAMES.noPasswordSet,
          message: "no password set",
        })
      )
    );
    const user = userEvent.setup();
    const testTitle = "No Password Set";

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider
          text={{ "error.title.noPasswordSet": testTitle }}
          factors={[{ method: "password" }]}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();
    expect(screen.getByText(testTitle)).toBeInTheDocument();
  });

  test("should go back to the initial state as the primary action in noPasswordSet state", async () => {
    const logInMock = vi.fn(() =>
      Promise.reject(
        new Errors.SlashIDError({
          name: Errors.ERROR_NAMES.noPasswordSet,
          message: "no password set",
        })
      )
    );
    const user = userEvent.setup();
    const testTitle = "No Password Set";

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider
          text={{ "error.title.noPasswordSet": testTitle }}
          factors={[{ method: "password" }]}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();

    const retryButton = screen.getByTestId("sid-form-error-retry-button");

    user.click(retryButton);

    await expect(
      screen.findByTestId("sid-form-initial-state")
    ).resolves.toBeInTheDocument();
  });

  test("should render the recoverNonReachableHandleType error state", async () => {
    const mockSlashID = new MockSlashID({
      oid: "oid",
      analyticsEnabled: false,
    });
    const logInPromise = new Deferred<User>();
    const logInMock = vi.fn(() => logInPromise);
    const user = userEvent.setup();
    const testTitle = "Recover non reachable handle";

    render(
      <TestSlashIDProvider sid={mockSlashID} sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider
          text={{ "error.title.recoverNonReachableHandleType": testTitle }}
          factors={[
            {
              method: "password",
              allowedHandleTypes: ["username"],
            },
          ]}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputUsername("non-reachable");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    // go to authenticating state
    await expect(
      screen.findByTestId("sid-form-authenticating-state")
    ).resolves.toBeInTheDocument();

    // enable the password input
    mockSlashID.mockPublish("passwordVerifyReady", undefined);

    // find the recover button and click it
    const recoverButton = await screen.findByTestId(
      "sid-form-authenticating-recover-button"
    );

    user.click(recoverButton);

    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();
    expect(screen.getByText(testTitle)).toBeInTheDocument();

    // cleanup
    logInPromise.reject();
  });

  test("should go back to the initial state as the primary action in recoverNonReachableHandleType state", async () => {
    const mockSlashID = new MockSlashID({
      oid: "oid",
      analyticsEnabled: false,
    });
    const logInPromise = new Deferred<User>();
    const logInMock = vi.fn(() => logInPromise);
    const user = userEvent.setup();
    const testTitle = "Recover non reachable handle";

    render(
      <TestSlashIDProvider sid={mockSlashID} sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider
          text={{ "error.title.recoverNonReachableHandleType": testTitle }}
          factors={[
            {
              method: "password",
              allowedHandleTypes: ["username"],
            },
          ]}
        >
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputUsername("non-reachable");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    // go to authenticating state
    await expect(
      screen.findByTestId("sid-form-authenticating-state")
    ).resolves.toBeInTheDocument();

    // enable the password input
    mockSlashID.mockPublish("passwordVerifyReady", undefined);

    // find the recover button and click it
    const recoverButton = await screen.findByTestId(
      "sid-form-authenticating-recover-button"
    );

    user.click(recoverButton);

    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();

    const retryButton = screen.getByTestId("sid-form-error-retry-button");

    user.click(retryButton);

    await expect(
      screen.findByTestId("sid-form-initial-state")
    ).resolves.toBeInTheDocument();

    // cleanup
    logInPromise.reject();
  });
});
