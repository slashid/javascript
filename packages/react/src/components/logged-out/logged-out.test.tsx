import { render, screen } from "@testing-library/react";

import { LoggedOut } from ".";
import {
  TestSlashIDProvider,
  TEST_USER,
} from "../../context/test-slash-id-provider";
import { faker } from "@faker-js/faker";
import { sdkNotReadyStates } from "../../domain/sdk-state";

const TestComponent = ({ text }: { text: string }) => <h1>{text}</h1>;

describe("LoggedOut", () => {
  test("should render children when a user is not logged in", () => {
    const text = faker.lorem.sentence()

    render(
      <TestSlashIDProvider user={undefined} sdkState="ready">
        <LoggedOut>
          <TestComponent text={text} />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test("should not render children when a user is logged in", () => {
    const text = faker.lorem.sentence()

    render(
      <TestSlashIDProvider user={TEST_USER} sdkState="ready">
        <LoggedOut>
          <TestComponent text={text} />
        </LoggedOut>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  for (const state of sdkNotReadyStates) {
    test(`should not render children when sdk state is ${state}`, () => {
      const text = faker.lorem.sentence()

      render(
        <TestSlashIDProvider user={TEST_USER} sdkState="ready">
          <LoggedOut>
            <TestComponent text={text} />
          </LoggedOut>
        </TestSlashIDProvider>
      );
      expect(screen.queryByText("Test")).not.toBeInTheDocument();
    });
  }
});
