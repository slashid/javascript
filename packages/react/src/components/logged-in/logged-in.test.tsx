import { FactorMethod } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";

import { LoggedIn } from ".";
import { TestSlashIDProvider } from "../../context/test-providers";
import { createAnonymousTestUser, createTestUser } from "../test-utils";

const TestComponent = () => <h1>Test</h1>;

describe("LoggedIn", () => {
  test("should render children when a user exists", () => {
    render(
      <TestSlashIDProvider user={createTestUser()}>
        <LoggedIn>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when a user does not exist", () => {
    render(
      <TestSlashIDProvider user={undefined}>
        <LoggedIn>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("should not render children when an anonymous user exists", () => {
    render(
      <TestSlashIDProvider user={createAnonymousTestUser()}>
        <LoggedIn>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("should render children when user is authenticated with correct method", () => {
    const authMethods: FactorMethod[] = ["email_link", "otp_via_sms"];
    const user = createTestUser({ authMethods });

    render(
      <TestSlashIDProvider user={user}>
        <LoggedIn withFactorMethods={authMethods}>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when user is not authenticated with correct method", () => {
    const authMethods: FactorMethod[] = ["email_link", "otp_via_sms"];
    const user = createTestUser({ authMethods });

    render(
      <TestSlashIDProvider user={user}>
        <LoggedIn withFactorMethods={["webauthn"]}>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );

    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("should render children when callback function returns `true`", () => {
    const authMethods: FactorMethod[] = ["email_link", "otp_via_sms"];
    const user = createTestUser({ authMethods });

    render(
      <TestSlashIDProvider user={user}>
        <LoggedIn
          withFactorMethods={(factors) => factors.includes("email_link")}
        >
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when callback function returns `false`", () => {
    const authMethods: FactorMethod[] = ["email_link", "otp_via_sms"];
    const user = createTestUser({ authMethods });

    render(
      <TestSlashIDProvider user={user}>
        <LoggedIn withFactorMethods={(factors) => factors.includes("webauthn")}>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );

    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });
});
