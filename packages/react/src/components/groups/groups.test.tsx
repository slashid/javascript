import { User } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";

import { Groups } from ".";
import {
  TestSlashIDProvider,
  TEST_TOKEN,
} from "../../context/test-slash-id-provider";
import { SDKState } from "../../context/slash-id-context";

const TestComponent = () => <h1>Test</h1>;

describe("Groups", () => {
  test("should render children when the SDK is ready and the user belongs to the specified groups", () => {
    const userWithGroups = new User(TEST_TOKEN);
    userWithGroups.getGroups = vi.fn(() => ["groupa"]);
    const belongsTo = vi.fn((groups: string[]) => groups.includes("groupa"));

    render(
      <TestSlashIDProvider sdkState={SDKState.Ready} user={userWithGroups}>
        <Groups belongsTo={belongsTo}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

    expect(belongsTo).toHaveBeenCalledWith(["groupa"]);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when the SDK is ready and the user does not belong to the specified groups", () => {
    const userWithGroups = new User(TEST_TOKEN);
    userWithGroups.getGroups = vi.fn(() => ["groupb"]);
    const belongsTo = vi.fn((groups: string[]) => groups.includes("groupa"));

    render(
      <TestSlashIDProvider sdkState={SDKState.Ready} user={userWithGroups}>
        <Groups belongsTo={belongsTo}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

    expect(belongsTo).toHaveBeenCalledWith(["groupb"]);
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("should not render children when the SDK is not ready", () => {
    const belongsTo = vi.fn();

    render(
      <TestSlashIDProvider sdkState={SDKState.Initial}>
        <Groups belongsTo={belongsTo}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

    expect(belongsTo).not.toHaveBeenCalled();
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("should not render children when the SDK is ready but there is no user", () => {
    const belongsTo = vi.fn();

    render(
      <TestSlashIDProvider sdkState={SDKState.Ready} user={undefined}>
        <Groups belongsTo={belongsTo}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

    expect(belongsTo).not.toHaveBeenCalled();
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });
});
