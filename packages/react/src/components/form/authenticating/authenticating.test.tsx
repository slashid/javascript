import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import { AuthenticatingImplementation as Authenticating } from "./index";
import { AuthenticatingState } from "../flow/flow.common";
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
  describe("under StrictMode", () => {
    const EVENT = "authnContextUpdateChallengeReceivedEvent" as const;

    function renderStrict(flowState: AuthenticatingState, sid: MockSlashID) {
      return render(
        <StrictMode>
          <TestSlashIDProvider sid={sid} sdkState="ready" logIn={vi.fn()}>
            <TestTextProvider text={TEXT}>
              <Authenticating flowState={flowState} />
            </TestTextProvider>
          </TestSlashIDProvider>
        </StrictMode>
      );
    }

    test("still renders the authenticating UI once the challenge arrives", async () => {
      const flowState = createTestAuhenticatingState({
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "test@mail.com" },
      });
      const sid = new MockSlashID({ oid: "oid", analyticsEnabled: false });

      renderStrict(flowState, sid);
      sid.mockPublish(EVENT, {
        targetOrgId: "oid",
        factor: { method: "email_link" },
      });

      await expect(
        screen.findByText(/test@mail.com/)
      ).resolves.toBeInTheDocument();
    });

    test("performs the login exactly once per attempt", () => {
      const sid = new MockSlashID({ oid: "oid", analyticsEnabled: false });
      const first = createTestAuhenticatingState({
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "test@mail.com" },
      });

      const { rerender } = renderStrict(first, sid);
      expect(first.logIn).toHaveBeenCalledTimes(1);

      const sameAttempt = createTestAuhenticatingState({
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "test@mail.com" },
      });
      rerender(
        <StrictMode>
          <TestSlashIDProvider sid={sid} sdkState="ready" logIn={vi.fn()}>
            <TestTextProvider text={TEXT}>
              <Authenticating flowState={sameAttempt} />
            </TestTextProvider>
          </TestSlashIDProvider>
        </StrictMode>
      );
      expect(sameAttempt.logIn).not.toHaveBeenCalled();

      const retry = createTestAuhenticatingState({
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "test@mail.com" },
        attempt: 2,
      });
      rerender(
        <StrictMode>
          <TestSlashIDProvider sid={sid} sdkState="ready" logIn={vi.fn()}>
            <TestTextProvider text={TEXT}>
              <Authenticating flowState={retry} />
            </TestTextProvider>
          </TestSlashIDProvider>
        </StrictMode>
      );
      expect(retry.logIn).toHaveBeenCalledTimes(1);
    });
  });

  describe("event subscriptions", () => {
    const EVENT = "authnContextUpdateChallengeReceivedEvent" as const;
    // the event buffer keeps one internal handler per event name, always
    const BUFFERED = 1;

    test("releases the challenge subscription when it unmounts before the event", () => {
      const flowState = createTestAuhenticatingState({
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "test@mail.com" },
      });
      const mockSlashID = new MockSlashID({
        oid: "oid",
        analyticsEnabled: false,
      });

      const { unmount } = render(
        <TestSlashIDProvider sid={mockSlashID} sdkState="ready" logIn={vi.fn()}>
          <TestTextProvider text={TEXT}>
            <Authenticating flowState={flowState} />
          </TestTextProvider>
        </TestSlashIDProvider>
      );

      expect(mockSlashID.mockObserverCount(EVENT)).toBe(BUFFERED + 1);

      unmount();

      expect(mockSlashID.mockObserverCount(EVENT)).toBe(BUFFERED);
    });

    test("does not accumulate subscriptions across attempts", () => {
      const mockSlashID = new MockSlashID({
        oid: "oid",
        analyticsEnabled: false,
      });
      const first = createTestAuhenticatingState({
        factor: { method: "hook" },
        handle: { type: "email_address", value: "test@mail.com" },
      });
      const second = createTestAuhenticatingState({
        factor: { method: "email_link" },
        handle: { type: "email_address", value: "test@mail.com" },
        attempt: 2,
      });

      const { rerender } = render(
        <TestSlashIDProvider sid={mockSlashID} sdkState="ready" logIn={vi.fn()}>
          <TestTextProvider text={TEXT}>
            <Authenticating flowState={first} />
          </TestTextProvider>
        </TestSlashIDProvider>
      );

      rerender(
        <TestSlashIDProvider sid={mockSlashID} sdkState="ready" logIn={vi.fn()}>
          <TestTextProvider text={TEXT}>
            <Authenticating flowState={second} />
          </TestTextProvider>
        </TestSlashIDProvider>
      );

      expect(mockSlashID.mockObserverCount(EVENT)).toBe(BUFFERED + 1);
    });
  });
});
