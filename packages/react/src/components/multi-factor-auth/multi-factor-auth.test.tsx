import type { StepConfig } from "./multi-factor-auth";
import { MultiFactorAuth } from "./multi-factor-auth";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { TestSlashIDProvider } from "../../context/test-providers";
import { createTestUser, inputEmail, inputPhone } from "../test-utils";

describe("#MultiFactorAuth", () => {
  test("MFA flow", async () => {
    const testUser = createTestUser({ authMethods: ["email_link"] });
    const logInMock = vi.fn(async () => testUser);
    const mfaMock = vi.fn(async () => testUser);
    const user = userEvent.setup();
    const mfaText = "TEST TITLE MFA";

    const steps: StepConfig[] = [
      { factors: [{ method: "email_link" }] },
      {
        factors: [{ method: "otp_via_sms" }],
        text: {
          "initial.title": mfaText,
        },
      },
    ];

    // initial form state
    const { rerender } = render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <MultiFactorAuth steps={steps} />
      </TestSlashIDProvider>
    );

    // first factor authentication - email
    inputEmail("valid@email.com");
    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await waitFor(() => expect(logInMock).toHaveBeenCalledTimes(1));

    // update user instance for correct <LoggedIn /> <LoggedOut /> behaviour
    rerender(
      <TestSlashIDProvider
        sdkState="ready"
        logIn={logInMock}
        user={testUser}
        mfa={mfaMock}
      >
        <MultiFactorAuth steps={steps} />
      </TestSlashIDProvider>
    );
    await expect(screen.findByText(mfaText)).resolves.toBeInTheDocument();

    // second factor authentication - phone number
    inputPhone("7975777666");
    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await waitFor(() => expect(mfaMock).toHaveBeenCalledTimes(1));
    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
  });
});
