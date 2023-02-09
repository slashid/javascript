import { User } from "@slashid/slashid";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from ".";
import { TEXT } from "../text/constants";

import {
  TestSlashIDProvider,
  TEST_USER,
} from "../../context/test-slash-id-provider";

const inputEmail = (value: string) => {
  const input = screen.getByPlaceholderText(TEXT["initial.handle.phone.email"]);
  fireEvent.change(input, { target: { value } });
};

describe("#Form", () => {
  test("should render in the initial state", () => {
    const logInMock = vi.fn(() => Promise.resolve(TEST_USER));

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form />
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-form-initial-state")).toBeInTheDocument();
  });

  test("should render error message - empty email input", async () => {
    const logInMock = vi.fn(() => Promise.resolve(TEST_USER));
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
    const logInMock = vi.fn(() => Promise.resolve(TEST_USER));
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
    const logInMock = vi.fn(() => Promise.resolve(TEST_USER));
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
    const logInMock = vi.fn(() => Promise.resolve(TEST_USER));
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
      r(TEST_USER);
    }
  });

  test("should show the success state on successful login", async () => {
    const logInMock = vi.fn(() => Promise.resolve(TEST_USER));
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
});
