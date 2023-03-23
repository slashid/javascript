import type { StepConfig } from "./multi-factor-auth";
import { MultiFactorAuth } from "./multi-factor-auth";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import {
  TestSlashIDProvider,
  TEST_USER,
} from "../../context/test-slash-id-provider";
import { inputEmail, inputPhone } from "../test-utils";

describe("#MultiFactorAuth", () => {
  test("MFA flow", async () => {
    const logInMock = vi.fn(() => Promise.resolve(TEST_USER));
    const mfaMock = vi.fn(() => Promise.resolve(TEST_USER));
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
        user={TEST_USER}
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
