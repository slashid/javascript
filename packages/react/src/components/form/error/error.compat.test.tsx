import { Errors } from "@slashid/slashid";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestSlashIDProvider } from "../../../context/test-providers";
import { Form } from "../form";
import { inputEmail } from "../../test-utils";
import { ConfigurationProvider } from "../../../main";
import { TEXT } from "../../text/constants";

// Simulates an older supported SDK (peer range >= 3.30.0) without the new guards.
vi.mock("@slashid/slashid", async (importOriginal) => {
  const m = await importOriginal<typeof import("@slashid/slashid")>();
  return {
    ...m,
    Errors: {
      ...m.Errors,
      isEmailDomainRoutedNotMemberError: undefined,
      isConsoleSSOSignInRequiredError: undefined,
    },
  };
});

describe("#Form -> Error state -> SDK without the API error code guards", () => {
  test("an SDK without the new guards still renders the self-registration screen", async () => {
    const logInMock = vi.fn(() =>
      Promise.reject(
        Errors.createSlashIDError({
          name: Errors.ERROR_NAMES.selfRegistrationNotAllowed,
          message: "x",
        })
      )
    );
    const user = userEvent.setup();

    render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <ConfigurationProvider factors={[{ method: "password" }]}>
          <Form />
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    inputEmail("person@example.com");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-error-state")
    ).resolves.toBeInTheDocument();
    expect(
      screen.getByText(TEXT["error.title.selfRegistrationNotAllowed"])
    ).toBeInTheDocument();
  });
});
