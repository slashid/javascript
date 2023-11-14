import { render, screen } from "@testing-library/react";

import { Groups } from ".";
import {
  TestSlashIDProvider
} from "../../context/test-slash-id-provider";
import { createTestUser } from "../test-utils";
import { faker } from "@faker-js/faker";

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

  test("should render children when the SDK is ready and the user belongs to the specified groups, provided as string", () => {
    const userWithGroups = createTestUser()
    const group = "groupa"

    userWithGroups.getGroups = vi.fn(() => [group]);

    render(
      <TestSlashIDProvider sdkState="ready" user={userWithGroups}>
        <Groups belongsTo={group}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when the SDK is ready and the user does not belongs to the specified groups, provided as string", () => {
    const userWithGroups = createTestUser()

    userWithGroups.getGroups = vi.fn(() => ["groupb"]);

    render(
      <TestSlashIDProvider sdkState="ready" user={userWithGroups}>
        <Groups belongsTo={"groupa"}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

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

  /**
   * Random variants of tests
   * 
   * These tests reduce the likelihood of false positives
   * but with the trade-off of readability.
   */
  test("should render children when the SDK is ready and the user belongs to the specified groups, provided as string (random)", () => {
    const userWithGroups = createTestUser()
    const groups = Array
      .from(Array(faker.number.int({ min: 3, max: 10 })))
      .map((_,i) => faker.company.buzzNoun() + i)

    userWithGroups.getGroups = vi.fn(() => groups);

    const [belongsTo] = faker.helpers.shuffle(groups)

    render(
      <TestSlashIDProvider sdkState="ready" user={userWithGroups}>
        <Groups belongsTo={belongsTo}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when the SDK is ready and the user does not belongs to the specified groups, provided as string (random)", () => {
    const userWithGroups = createTestUser()
    const groups = Array
      .from(Array(faker.number.int({ min: 3, max: 10 })))
      .map((_,i) => faker.company.buzzNoun() + i)

    userWithGroups.getGroups = vi.fn(() => groups);

    const expected = `${faker.company.buzzNoun()}_expected`

    render(
      <TestSlashIDProvider sdkState="ready" user={userWithGroups}>
        <Groups belongsTo={expected}>
          <TestComponent />
        </Groups>
      </TestSlashIDProvider>
    );

    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });
});

describe("Groups.*", () => {
  test("Groups.some should return true when one or more of users groups match required groups", () => {
    const required = ["alpha", "beta", "delta"]
    const groups = ["charlie", "delta"]

    const actual = Groups.some(...required)(groups)

    expect(actual).toBe(true)
  })
  test("Groups.some should return false when none of users groups match required groups", () => {
    const required = ["alpha", "beta"]
    const groups = ["charlie", "delta", "echo"]

    const actual = Groups.some(...required)(groups)

    expect(actual).toBe(false)
  })
  test("Groups.all should return true when users groups match all required groups", () => {
    const required = ["charlie", "echo"]
    const groups = ["alpha", "beta", "charlie", "delta", "echo"]

    const actual = Groups.all(...required)(groups)

    expect(actual).toBe(true)

  })
  test("Groups.all should return false when users groups do not match all required groups", () => {
    const required = ["alpha", "beta", "charlie", "delta", "echo", "foxtrot"]
    const groups = ["alpha", "delta", "echo"]

    const actual = Groups.all(...required)(groups)

    expect(actual).toBe(false)

  })
})