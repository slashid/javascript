import { render, screen } from "@testing-library/react";

import { LoggedOut } from "./logged-out";
import {
  TestSlashIDProvider,
  TEST_USER,
} from "../context/test-slash-id-provider";

const TestComponent = () => <h1>Test</h1>;

describe("LoggedOut", () => {
  test("should render children when the SDK is ready and a user is not logged in", () => {
    render(
      <TestSlashIDProvider sdkState="ready" user={undefined}>
        <LoggedOut>
          <TestComponent />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when the SDK is not ready", () => {
    render(
      <TestSlashIDProvider sdkState="initial">
        <LoggedOut>
          <TestComponent />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("should not render children when the SDK is ready and a user is logged in", () => {
    render(
      <TestSlashIDProvider sdkState="ready" user={TEST_USER}>
        <LoggedOut>
          <TestComponent />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });
});
