import { render, screen } from "@testing-library/react";

import { Groups } from ".";
import {
  TestSlashIDProvider
} from "../../context/test-slash-id-provider";
import { createTestUser } from "../test-utils";

const TestComponent = () => <h1>Test</h1>;

describe("Groups", () => {
  test("should render children when the SDK is ready and the user belongs to the specified groups", () => {
    const userWithGroups = createTestUser()
    userWithGroups.getGroups = vi.fn(() => ["groupa"]);
    const belongsTo = vi.fn((groups: string[]) => groups.includes("groupa"));

    render(
      <TestSlashIDProvider sdkState="ready" user={userWithGroups}>
        <Groups belongsTo={belongsTo}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

    expect(belongsTo).toHaveBeenCalledWith(["groupa"]);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when the SDK is ready and the user does not belong to the specified groups", () => {
    const userWithGroups = createTestUser()
    userWithGroups.getGroups = vi.fn(() => ["groupb"]);
    const belongsTo = vi.fn((groups: string[]) => groups.includes("groupa"));

    render(
      <TestSlashIDProvider sdkState="ready" user={userWithGroups}>
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
      <TestSlashIDProvider sdkState="initial">
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
      <TestSlashIDProvider sdkState="ready" user={undefined}>
        <Groups belongsTo={belongsTo}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

    expect(belongsTo).not.toHaveBeenCalled();
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });
});
