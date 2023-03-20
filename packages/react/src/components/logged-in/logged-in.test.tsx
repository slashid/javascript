import { FactorMethod } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";

import { LoggedIn } from ".";
import {
  TestSlashIDProvider,
  TEST_USER,
  NewTestUserWithAuthMethods,
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

  test("should render children when user is authenticated with correct method", () => {
    const methods: FactorMethod[] = ["email_link", "otp_via_sms"];
    const user = NewTestUserWithAuthMethods(methods);

    render(
      <TestSlashIDProvider user={user}>
        <LoggedIn withFactorMethods={methods}>
          <TestComponent />
        </LoggedIn>
      </TestSlashIDProvider>
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("should not render children when user is not authenticated with correct method", () => {
    const methods: FactorMethod[] = ["email_link", "otp_via_sms"];
    const user = NewTestUserWithAuthMethods(methods);

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
    const methods: FactorMethod[] = ["email_link", "otp_via_sms"];
    const user = NewTestUserWithAuthMethods(methods);

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
    const methods: FactorMethod[] = ["email_link", "otp_via_sms"];
    const user = NewTestUserWithAuthMethods(methods);

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
