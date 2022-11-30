import { render, screen } from "@testing-library/react";

import { LoggedIn } from "./logged-in";
import {
  TestSlashIDProvider,
  TEST_USER,
} from "../context/test-slash-id-provider";

const TestComponent = () => <h1>Test</h1>;

describe("LoggedIn", () => {
  test("should render children when the SDK is ready and a user is logged in", () => {
    render(
      <TestSlashIDProvider sdkState="ready" user={TEST_USER}>
        <LoggedIn>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when the SDK is not ready", () => {
    render(
      <TestSlashIDProvider sdkState="initial">
        <LoggedIn>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("should not render children when the SDK is ready but there is no user", () => {
    render(
      <TestSlashIDProvider sdkState="ready" user={undefined}>
        <LoggedIn>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });
});
