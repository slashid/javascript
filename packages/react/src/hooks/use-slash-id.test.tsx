import { render, screen } from "@testing-library/react";
import { SlashIDProvider } from "..";
import { useSlashID } from "./use-slash-id";
import { TEST_ORG_ID, TEST_PERSON_ID, createTestUser } from "../components/test-utils";

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
      <SlashIDProvider initialToken={createTestUser().token} oid={TEST_ORG_ID}>
        <TestComponent />
      </SlashIDProvider>
    );

    expect.assertions(1);
    await expect(
      screen.findByText(TEST_PERSON_ID)
    ).resolves.toBeInTheDocument();
  });
});
