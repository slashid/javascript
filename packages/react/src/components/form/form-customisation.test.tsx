import { render, screen } from "@testing-library/react";
import { Form, FormErrorState } from ".";
import { TestSlashIDProvider } from "../../context/test-slash-id-provider";
import { createTestUser, inputEmail } from "../test-utils";
import { Slot } from "../slot";
import userEvent from "@testing-library/user-event";
import { ConfigurationProvider } from "../../main";
import { useState } from "react";
import { Factor } from "@slashid/slashid";
import { Handle } from "../../domain/types";

describe("#Form - customisation", () => {
  test(`should not render any components that are not a <Slot name="initial | authenticating | success | error | footer">`, () => {
    const logInMock = vi.fn(async () => createTestUser());

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form>
          <Slot name="wrong">
            <div data-testid="wrong-slot-name">Incorrect slot name</div>
          </Slot>
          <div data-testid="incorrect-component">Incorrect component</div>
        </Form>
      </TestSlashIDProvider>
    );

    expect(screen.queryByTestId("wrong-slot-name")).toBeFalsy();
    expect(screen.queryByTestId("incorrect-component")).toBeFalsy();
  });

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

  test("should render the error slot with children as a function", async () => {
    const logInMock = vi.fn(() => Promise.reject("login error"));
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <Form>
          <Slot name="error">
            <FormErrorState key="error slot child">
              {({ context, retry, cancel }) => (
                <div data-testid="custom-error-function">
                  <h1>{context.error.message}</h1>
                  <button onClick={retry}>Retry</button>
                  <button onClick={cancel}>Cancel</button>
                </div>
              )}
            </FormErrorState>
          </Slot>
        </Form>
      </TestSlashIDProvider>
    );

    inputEmail("valid@email.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(logInMock).rejects.toMatch("login error");
    await expect(
      screen.findByTestId("custom-error-function")
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
        screen.getByTestId("sid-form-initial-children")
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

    test("should authenticate users with a form composed of children as functions", async () => {
      const logInMock = vi.fn(async () => createTestUser());
      const user = userEvent.setup();

      const ComposedForm = ({
        handleSubmit,
      }: {
        handleSubmit: (factor: Factor, handle?: Handle | undefined) => void;
      }) => {
        const [email, setEmail] = useState("");

        return (
          <form
            data-testid="composed-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(
                { method: "email_link" },
                { type: "email_address", value: email }
              );
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
            <Form.Initial.Controls.Submit />
          </form>
        );
      };

      render(
        <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
          <ConfigurationProvider factors={[{ method: "email_link" }]}>
            <Form>
              <Slot name="initial">
                <Form.Initial.Controls>
                  {({ handleSubmit }) => {
                    return <ComposedForm handleSubmit={handleSubmit} />;
                  }}
                </Form.Initial.Controls>
              </Slot>
              <Slot name="success">
                <div data-testid="custom-success">Custom success</div>
              </Slot>
            </Form>
          </ConfigurationProvider>
        </TestSlashIDProvider>
      );

      expect(
        screen.getByTestId("sid-form-initial-function")
      ).toBeInTheDocument();
      expect(screen.getByTestId("composed-form")).toBeInTheDocument();

      const emailAddress = "valid@email.com";
      inputEmail(emailAddress, "email");
      user.click(screen.getByTestId("sid-form-initial-submit-button"));

      await expect(
        screen.findByTestId("custom-success")
      ).resolves.toBeInTheDocument();

      expect(logInMock).toHaveBeenCalledWith(
        {
          factor: { method: "email_link" },
          handle: { type: "email_address", value: emailAddress },
        },
        { middleware: undefined }
      );
    });
  });
});
