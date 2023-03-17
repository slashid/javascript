import { MFA } from "./mfa";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  TestSlashIDProvider,
  TEST_USER,
} from "../../context/test-slash-id-provider";
import { TEXT } from "../text/constants";

const inputEmail = (value: string) => {
  const input = screen.getByPlaceholderText(TEXT["initial.handle.phone.email"]);
  fireEvent.change(input, { target: { value } });
};

const inputPhone = (value: string) => {
  const input = screen.getByPlaceholderText(
    TEXT["initial.handle.phone.placeholder"]
  );
  fireEvent.change(input, { target: { value } });
};

describe("#MFA", () => {
  test("MFA flow", async () => {
    const logInMock = vi.fn(() => Promise.resolve(TEST_USER));
    const mfaMock = vi.fn(() => Promise.resolve(TEST_USER));

    const user = userEvent.setup();
    const mfaText = "TEST TITLE MFA";

    const { rerender } = render(
      <TestSlashIDProvider sdkState="ready" logIn={logInMock}>
        <MFA
          factors={[{ method: "otp_via_sms" }]}
          text={{
            "initial.title": mfaText,
          }}
        />
      </TestSlashIDProvider>
    );

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
        <MFA
          factors={[{ method: "otp_via_sms" }]}
          text={{
            "initial.title": mfaText,
          }}
        />
      </TestSlashIDProvider>
    );

    await expect(screen.findByText(mfaText)).resolves.toBeInTheDocument();

    inputPhone("7975777666");

    user.click(screen.getByTestId("sid-form-initial-submit-button"));

    await expect(
      screen.findByTestId("sid-form-success-state")
    ).resolves.toBeInTheDocument();
  });
});
