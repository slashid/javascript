import { render, screen } from "@testing-library/react";

import { LoggedIn } from ".";
import {
  TestSlashIDProvider,
  TEST_USER,
} from "../../context/test-slash-id-provider";

const TestComponent = () => <h1>Test</h1>;

describe("LoggedIn", () => {
  test("should render children when a user is logged in", () => {
    render(
      <TestSlashIDProvider user={TEST_USER}>
        <LoggedIn>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when a user not is logged in", () => {
    render(
      <TestSlashIDProvider user={undefined}>
        <LoggedIn>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });
});
