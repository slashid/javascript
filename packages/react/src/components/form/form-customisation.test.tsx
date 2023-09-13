import { render, screen } from "@testing-library/react";
import { Form } from ".";
import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { createTestUser, inputEmail } from "../test-utils";
import { Slot } from "../slot";
import userEvent from "@testing-library/user-event";
import { ConfigurationProvider } from "../../main";

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

    expect(screen.queryByTestId("sid-form-initial-state")).toBeFalsy();
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
    expect(screen.queryByTestId("sid-form-authenticating-state")).toBeFalsy();
  });

  test("should render the error slot", async () => {
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

  describe("#Form.Initial - composition API", () => {
    test("should render the default controls and arbitrary children", () => {
      const logInMock = vi.fn(async () => createTestUser());

      render(
        <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
          <ConfigurationProvider factors={[{ method: "email_link" }]}>
            <Form>
              <Slot name="initial">
                <Form.Initial.Logo />
                <Form.Initial.Header />
                <div data-testid="custom-text-initial">
                  Components can be added to the initial slot
                </div>
                <Form.Initial.Controls>
                  <Form.Initial.Controls.Input />
                  <div data-testid="custom-text-controls">
                    Components can be added to the controls slot
                  </div>
                  <Form.Initial.Controls.Submit />
                </Form.Initial.Controls>
              </Slot>
            </Form>
          </ConfigurationProvider>
        </TestSlashIDProvider>
      );

      expect(screen.queryByTestId("sid-form-initial-state")).toBeFalsy();
      expect(screen.getByTestId("custom-text-initial")).toBeInTheDocument();
      expect(screen.getByTestId("custom-text-controls")).toBeInTheDocument();
      expect(
        screen.getByTestId("sid-form-initial-submit-button")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("sid-form-initial-default")
      ).toBeInTheDocument();
    });

    test("should render custom controls when children are passed as functions", () => {
      const logInMock = vi.fn(async () => createTestUser());

      render(
        <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
          <ConfigurationProvider factors={[{ method: "email_link" }]}>
            <Form>
              <Slot name="initial">
                <Form.Initial.Controls>
                  <Form.Initial.Controls.Input>
                    {({ factors, handleTypes }) => {
                      return (
                        <div data-testid="initial-controls-input-function">
                          {factors.map((factor) => (
                            <div key={factor.method}>{factor.method}</div>
                          ))}
                          {handleTypes.map((handleType) => (
                            <div key={handleType}>{handleType}</div>
                          ))}
                        </div>
                      );
                    }}
                  </Form.Initial.Controls.Input>
                  <Form.Initial.Controls.Submit />
                </Form.Initial.Controls>
              </Slot>
            </Form>
          </ConfigurationProvider>
        </TestSlashIDProvider>
      );

      expect(
        screen.getByTestId("sid-form-initial-children")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("initial-controls-input-function")
      ).toBeInTheDocument();
      expect(screen.getByText("email_link")).toBeInTheDocument();
      expect(screen.getByText("email_address")).toBeInTheDocument();
    });
  });
});
