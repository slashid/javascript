import { render, screen } from "@testing-library/react";
import { AuthenticatingImplementation as Authenticating } from "./index";
import { AuthenticatingState } from "../flow";
import { TestTextProvider } from "../../../context/test-providers";
import { TEXT } from "../../text/constants";

type CreateTestAuthenticatingStateInput = {
  factor: AuthenticatingState["context"]["config"]["factor"];
  handle: AuthenticatingState["context"]["config"]["handle"];
  attempt?: AuthenticatingState["context"]["attempt"];
};
function createTestAuhenticatingState({
  factor,
  handle,
  attempt,
}: CreateTestAuthenticatingStateInput): AuthenticatingState {
  return {
    status: "authenticating",
    context: {
      config: {
        factor,
        handle,
      },
      attempt: attempt ?? 1,
    },
    logIn: jest.fn(),
    retry: jest.fn(),
    cancel: jest.fn(),
    recover: jest.fn(),
    updateContext: jest.fn(),
    setRecoveryCodes: jest.fn(),
  };
}

describe("Authenticating", () => {
  test("should render the email link authenticating state", () => {
    const flowState: AuthenticatingState = createTestAuhenticatingState({
      factor: { method: "email_link" },
      handle: { type: "email_address", value: "test@mail.com" },
    });

    render(
      <TestTextProvider text={TEXT}>
        <Authenticating flowState={flowState} />
      </TestTextProvider>
    );

    expect(
      screen.getByTestId("sid-form-authenticating-state")
    ).toBeInTheDocument();
    expect(screen.getByText(/test@mail.com/)).toBeInTheDocument();
  });

  test("should not render the subtitle if `authenticating.subtitle` is not set", () => {
    const flowState: AuthenticatingState = createTestAuhenticatingState({
      factor: { method: "email_link" },
      handle: { type: "email_address", value: "test@mail.test" },
    });

    render(
      <TestTextProvider text={TEXT}>
        <Authenticating flowState={flowState} />
      </TestTextProvider>
    );

    expect(
      screen.getByTestId("sid-form-authenticating-state")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("sid-text-authenticating-subtitle")
    ).toBeFalsy();
  });

  test("should render the subtitle if `authenticating.subtitle` is set", () => {
    const flowState: AuthenticatingState = createTestAuhenticatingState({
      factor: { method: "email_link" },
      handle: { type: "email_address", value: "test@mail.test" },
    });
    const textWithAuthenticatingSubtitle = {
      ...TEXT,
      "authenticating.subtitle": "Authenticating subtitle",
    };

    render(
      <TestTextProvider text={textWithAuthenticatingSubtitle}>
        <Authenticating flowState={flowState} />
      </TestTextProvider>
    );

    expect(
      screen.getByTestId("sid-form-authenticating-state")
    ).toBeInTheDocument();
    expect(screen.getByText("Authenticating subtitle")).toBeInTheDocument();
  });
});
