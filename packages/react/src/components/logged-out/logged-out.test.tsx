import { render, screen } from "@testing-library/react";

import { LoggedOut } from ".";
import {
  TestSlashIDProvider,
  TEST_USER,
} from "../../context/test-slash-id-provider";
import { SDKState } from "../../context/slash-id-context";
import { sdkNotReadyStates } from "../test-utils";

const TestComponent = () => <h1>Test</h1>;

describe("LoggedOut", () => {
  test("should render children when a user is not logged in", () => {
    render(
      <TestSlashIDProvider user={undefined} sdkState={SDKState.Ready}>
        <LoggedOut>
          <TestComponent />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when a user is logged in", () => {
    render(
      <TestSlashIDProvider user={TEST_USER} sdkState={SDKState.Ready}>
        <LoggedOut>
          <TestComponent />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  for (const state of sdkNotReadyStates) {
    test(`should not render children when sdk state is ${state}`, () => {
      render(
        <TestSlashIDProvider user={TEST_USER} sdkState={SDKState.Ready}>
          <LoggedOut>
            <TestComponent />
          </LoggedOut>
        </TestSlashIDProvider>
      );
      expect(screen.queryByText("Test")).not.toBeInTheDocument();
    });
  }
});
