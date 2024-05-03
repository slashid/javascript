import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestSlashIDProvider } from "../../context/test-providers";
import { Form } from "./form";
import { createTestUser, inputEmail } from "../test-utils";
import { ConfigurationProvider } from "../../main";

describe("#Form -> Error state", () => {
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
