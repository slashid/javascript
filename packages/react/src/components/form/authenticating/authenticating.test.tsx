import { render, screen } from "@testing-library/react";
import { AuthenticatingImplementation as Authenticating } from "./index";
import { AuthenticatingState } from "../flow";
import {
  TestSlashIDProvider,
  TestTextProvider,
} from "../../../context/test-providers";
import { TEXT } from "../../text/constants";
import { MockSlashID } from "../../test-utils";

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
  test("should render the email link authenticating state", async () => {
    const flowState: AuthenticatingState = createTestAuhenticatingState({
      factor: { method: "email_link" },
      handle: { type: "email_address", value: "test@mail.com" },
    });
    const logInMock = vi.fn();
    const mockSlashID = new MockSlashID({
      oid: "oid",
      analyticsEnabled: false,
    });

    render(
      <TestSlashIDProvider sid={mockSlashID} sdkState="ready" logIn={logInMock}>
        <TestTextProvider text={TEXT}>
          <Authenticating flowState={flowState} />
        </TestTextProvider>
      </TestSlashIDProvider>
    );

    mockSlashID.mockPublish("authnContextUpdateChallengeReceivedEvent", {
      targetOrgId: "oid",
      factor: { method: "email_link" },
    });

    const authnState = await screen.findByTestId(
      "sid-form-authenticating-state"
    );
    expect(authnState).toBeInTheDocument();

    const emailDisplay = await screen.findByText(/test@mail.com/);
    expect(emailDisplay).toBeInTheDocument();
  });

  test("should not render the subtitle if `authenticating.subtitle` is not set", async () => {
    const flowState: AuthenticatingState = createTestAuhenticatingState({
      factor: { method: "email_link" },
      handle: { type: "email_address", value: "test@mail.test" },
    });
    const logInMock = vi.fn();
    const mockSlashID = new MockSlashID({
      oid: "oid",
      analyticsEnabled: false,
    });

    render(
      <TestSlashIDProvider sid={mockSlashID} sdkState="ready" logIn={logInMock}>
        <TestTextProvider text={TEXT}>
          <Authenticating flowState={flowState} />
        </TestTextProvider>
      </TestSlashIDProvider>
    );

    mockSlashID.mockPublish("authnContextUpdateChallengeReceivedEvent", {
      targetOrgId: "oid",
      factor: { method: "email_link" },
    });

    const authnState = await screen.findByTestId(
      "sid-form-authenticating-state"
    );
    expect(authnState).toBeInTheDocument();

    expect(
      screen.queryByTestId("sid-text-authenticating-subtitle")
    ).toBeFalsy();
  });

  test("should render the subtitle if `authenticating.subtitle` is set", async () => {
    const flowState: AuthenticatingState = createTestAuhenticatingState({
      factor: { method: "email_link" },
      handle: { type: "email_address", value: "test@mail.test" },
    });
    const textWithAuthenticatingSubtitle = {
      ...TEXT,
      "authenticating.subtitle": "Authenticating subtitle",
    };
    const logInMock = vi.fn();
    const mockSlashID = new MockSlashID({
      oid: "oid",
      analyticsEnabled: false,
    });

    render(
      <TestSlashIDProvider sid={mockSlashID} sdkState="ready" logIn={logInMock}>
        <TestTextProvider text={textWithAuthenticatingSubtitle}>
          <Authenticating flowState={flowState} />
        </TestTextProvider>
      </TestSlashIDProvider>
    );

    mockSlashID.mockPublish("authnContextUpdateChallengeReceivedEvent", {
      targetOrgId: "oid",
      factor: { method: "email_link" },
    });

    const authnState = await screen.findByTestId(
      "sid-form-authenticating-state"
    );
    expect(authnState).toBeInTheDocument();

    const subtitle = await screen.findByText("Authenticating subtitle");
    expect(subtitle).toBeInTheDocument();
  });
});
