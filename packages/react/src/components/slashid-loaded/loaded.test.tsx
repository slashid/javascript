import { render, screen } from "@testing-library/react";
import { SlashIDLoaded } from ".";
import { TestSlashIDProvider } from "../../context/test-providers";
import { faker } from "@faker-js/faker";
import { sdkNotReadyStates } from "../../domain/sdk-state";

const Mock = ({ text }: { text: string }) => <h1>{text}</h1>;

describe("SlashIDLoaded", () => {
  for (const state of sdkNotReadyStates) {
    test(`should not render children when sdk state is '${state}'`, () => {
      const text = faker.lorem.sentence();

      render(
        <TestSlashIDProvider sdkState={state}>
          <SlashIDLoaded>
            <Mock text={text} />
          </SlashIDLoaded>
        </TestSlashIDProvider>
      );
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    });
  }

  for (const state of sdkNotReadyStates) {
    test(`should render fallback when sdk state is '${state}'`, () => {
      const text = faker.lorem.sentence();
      const fallback = faker.lorem.sentence();

      render(
        <TestSlashIDProvider sdkState={state}>
          <SlashIDLoaded fallback={<Mock text={fallback} />}>
            <Mock text={text} />
          </SlashIDLoaded>
        </TestSlashIDProvider>
      );
      expect(screen.queryByText(fallback)).toBeInTheDocument();
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    });
  }

  test("should render children when sdk state is 'ready'", () => {
    const text = faker.lorem.sentence();

    render(
      <TestSlashIDProvider sdkState="ready">
        <SlashIDLoaded>
          <Mock text={text} />
        </SlashIDLoaded>
      </TestSlashIDProvider>
    );
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test("should not render fallback when sdk state is 'ready'", () => {
    const text = faker.lorem.sentence();
    const fallback = faker.lorem.sentence();

    render(
      <TestSlashIDProvider sdkState="ready">
        <SlashIDLoaded fallback={<Mock text={fallback} />}>
          <Mock text={text} />
        </SlashIDLoaded>
      </TestSlashIDProvider>
    );
    expect(screen.queryByText(fallback)).not.toBeInTheDocument();
  });
});
