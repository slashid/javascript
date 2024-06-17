import { render, screen } from "@testing-library/react";
import { Authenticating } from "./index";
import { AuthenticatingState } from "../flow";
import { TestTextProvider } from "../../../context/test-providers";
import { TEXT } from "../../text/constants";

describe("Authenticating", () => {
  test("should render the email link authenticating state", () => {
    const flowState: AuthenticatingState = {
      status: "authenticating",
      context: {
        config: {
          factor: {
            method: "email_link",
          },
          handle: {
            type: "email_address",
            value: "test@mail.com",
          },
        },
        attempt: 1,
      },
      logIn: jest.fn(),
      retry: jest.fn(),
      cancel: jest.fn(),
      recover: jest.fn(),
      setRecoveryCodes: jest.fn(),
    };

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
});
