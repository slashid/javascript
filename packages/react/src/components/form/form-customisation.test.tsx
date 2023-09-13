import { render, screen } from "@testing-library/react";
import { Form } from ".";
import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { createTestUser, inputEmail } from "../test-utils";
import { Slot } from "../slot";
import userEvent from "@testing-library/user-event";

describe("#Form - customisation", () => {
  test("should render the footer slot", () => {
    const logInMock = vi.fn(async () => createTestUser());

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form>
          <Slot name="footer">
            <div data-testid="custom-footer">Custom footer</div>
          </Slot>
        </Form>
      </TestSlashIDProvider>
    );

    expect(screen.getByTestId("sid-form-initial-state")).toBeInTheDocument();
    expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
  });

  test("should render the initial slot", () => {
    const logInMock = vi.fn(async () => createTestUser());

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form>
          <Slot name="initial">
            <div data-testid="custom-initial">Custom initial</div>
          </Slot>
        </Form>
      </TestSlashIDProvider>
    );

    expect(screen.findByTestId("sid-form-initial-state")).toBeFalsy();
    expect(screen.getByTestId("custom-initial")).toBeInTheDocument();
  });

  test("should render the authenticating slot", async () => {
    const logInMock = vi.fn(async () => createTestUser());
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form>
          <Slot name="authenticating">
            <div data-testid="custom-authenticating">Custom authenticating</div>
          </Slot>
        </Form>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");
    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("custom-authenticating")
    ).resolves.toBeInTheDocument();
    expect(screen.findByTestId("sid-form-authenticating-state")).toBeFalsy();
  });

  test.only("should render the error slot", async () => {
    const logInMock = vi.fn(() => Promise.reject("login error"));
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form>
          <Slot name="error">
            <div data-testid="custom-error">Custom error</div>
          </Slot>
        </Form>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(logInMock).rejects.toMatch("login error");
    await expect(
      screen.findByTestId("custom-error")
    ).resolves.toBeInTheDocument();
  });
});
