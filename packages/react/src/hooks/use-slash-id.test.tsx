import { render, screen } from "@testing-library/react";
import {
  TEST_ORG_ID,
  TEST_PERSON_ID,
  TEST_TOKEN,
} from "../context/test-slash-id-provider";
import { SlashIDProvider } from "../main";
import { useSlashID } from "./use-slash-id";

const TestComponent = () => {
  const { user } = useSlashID();

  if (!user) {
    return <div>Not logged in</div>;
  }

  return <div>{user.ID}</div>;
};

describe("useSlashID", () => {
  test("should return a user instance when a valid initial token is passed to the SlashIDProvider", async () => {
    render(
      <SlashIDProvider initialToken={TEST_TOKEN} oid={TEST_ORG_ID}>
        <TestComponent />
      </SlashIDProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(TEST_PERSON_ID)
    ).resolves.toBeInTheDocument();
  });
});
