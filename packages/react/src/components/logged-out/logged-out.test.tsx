import { render, screen } from "@testing-library/react";

import { LoggedOut } from ".";
import { TestSlashIDProvider } from "../../context/test-providers";
import { faker } from "@faker-js/faker";
import { sdkNotReadyStates } from "../../domain/sdk-state";
import { createAnonymousTestUser, createTestUser } from "../test-utils";

const TestComponent = ({ text }: { text: string }) => <h1>{text}</h1>;

describe("LoggedOut", () => {
  test("should render children when a user does not exist", () => {
    const text = faker.lorem.sentence();

    render(
      <TestSlashIDProvider user={undefined} sdkState="ready">
        <LoggedOut>
          <TestComponent text={text} />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test("should not render children when a user exists", () => {
    const text = faker.lorem.sentence();

    render(
      <TestSlashIDProvider user={createTestUser()} sdkState="ready">
        <LoggedOut>
          <TestComponent text={text} />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  test("should render children when an anonymous user exists", () => {
    const text = faker.lorem.sentence();

    render(
      <TestSlashIDProvider
        anonymousUser={createAnonymousTestUser()}
        sdkState="ready"
      >
        <LoggedOut>
          <TestComponent text={text} />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  for (const state of sdkNotReadyStates) {
    test(`should not render children when sdk state is ${state}`, () => {
      const text = faker.lorem.sentence();

      render(
        <TestSlashIDProvider user={createTestUser()} sdkState="ready">
          <LoggedOut>
            <TestComponent text={text} />
          </LoggedOut>
        </TestSlashIDProvider>
      );
      expect(screen.queryByText("Test")).not.toBeInTheDocument();
    });
  }
});
