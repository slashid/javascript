import { StepUpAuth } from "./step-up-auth";
import { render, screen, waitFor } from "@testing-library/react";
import {
  TestSlashIDProvider
} from "../../context/test-providers";
import userEvent from "@testing-library/user-event";
import { createTestUser, inputPhone } from "../test-utils";

describe("#StepUpAuth", () => {
  test("Step-Up Authentication flow", async () => {
    const mfaMock = vi.fn(async () => createTestUser());
    const user = userEvent.setup();
    const stepUpText = "TEST TITLE STEP-UP AUTH";

    // already authenticated user is presented with Step-Up Auth challenge
    render(
      <TestSlashIDProvider sdkState="ready" user={createTestUser()} mfa={mfaMock}>
        <StepUpAuth
          factors={[{ method: "otp_via_sms" }]}
          text={{
            "initial.title": stepUpText,
          }}
        />
      </TestSlashIDProvider>
    );
    await expect(screen.findByText(stepUpText)).resolves.toBeInTheDocument();

    // step-up authentication - phone number
    inputPhone("7975777666");
    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await waitFor(() => expect(mfaMock).toHaveBeenCalledTimes(1));
    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
  });
});
