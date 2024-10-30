import { JsonObject } from "@slashid/slashid";
import { UncontrolledInput } from "@slashid/react-primitives";

import { useOnboarding } from "./onboarding-context.hook";

import { OnboardingActions } from "./onboarding-actions.component";
import { OnboardingForm } from "./onboarding-form.component";
import { OnboardingStep } from "./onboarding-step.component";
import { OnboardingSuccess } from "./onboarding-success.component";
import { Onboarding } from "./onboarding.component";
import { useSlashID } from "../../hooks/use-slash-id";
import { ConfigurationProvider } from "../../context/config-context";
import {
  createAnonymousTestUser,
  createTestUser,
  inputEmail,
} from "../test-utils";
import { render, screen } from "@testing-library/react";
import { TestSlashIDProvider } from "../../context/test-providers";
import userEvent from "@testing-library/user-event";

function OnboardingFirstStep() {
  const { state, api } = useOnboarding();

  const handleSubmit = async (formValues: JsonObject) => {
    // store object as attributes
    return api.updateAttributes(formValues);
  };

  return (
    <OnboardingStep id="test1" beforeNext={handleSubmit}>
      <div data-testid="step1">Step 1</div>
      <UncontrolledInput
        id="sid-input--onboarding-first_name"
        name="first_name"
        type="text"
        label="First name"
        /* @ts-expect-error */
        defaultValue={state.attributes?.first_name}
      />
      <UncontrolledInput
        id="sid-input--onboarding-last_name"
        name="last_name"
        type="text"
        label="Last name"
        /* @ts-expect-error */
        defaultValue={state.attributes?.last_name}
      />
      <OnboardingActions />
    </OnboardingStep>
  );
}

function OnboardingDone() {
  const { user } = useSlashID();

  return (
    <div>
      <h1>Success!</h1>
      <div data-testid="userId">{user?.ID}</div>
    </div>
  );
}

describe("#Onboarding", () => {
  test("should lead the user through the steps in order and record attributes", async () => {
    const userEvents = userEvent.setup();
    // we'll need mocks for attributes
    const anonymousUser = createAnonymousTestUser();
    const registeredUser = createTestUser({ token: anonymousUser.token });
    const logInMock = vi.fn(async () => registeredUser);

    function createMockBucket() {
      let attributes: JsonObject = {};

      return {
        get: vi.fn(async () => attributes),
        set: vi.fn(async (attrs: JsonObject) => {
          attributes = attrs;
        }),
        delete: vi.fn(async () => {
          attributes = {};
        }),
      };
    }

    const mockBucket = createMockBucket();

    // @ts-expect-error depends on unexposed type alias, JsonObject is safe
    anonymousUser.getBucket = vi.fn(() => mockBucket);

    // issue - testing internal details
    // user.getBucket().set(attributes);

    render(
      <TestSlashIDProvider
        sdkState="ready"
        logIn={logInMock}
        anonymousUser={anonymousUser}
      >
        <ConfigurationProvider>
          <Onboarding>
            <OnboardingFirstStep />
            <OnboardingForm />
            <OnboardingSuccess>
              <OnboardingDone />
            </OnboardingSuccess>
          </Onboarding>
        </ConfigurationProvider>
      </TestSlashIDProvider>
    );

    await expect(screen.findByTestId("step1")).resolves.toBeInTheDocument();

    // enter the data to be saved as attributes
    const firstNameInput = screen.getByLabelText("First name");
    const lastNameInput = screen.getByLabelText("Last name");

    await userEvents.click(firstNameInput);
    await userEvents.keyboard("John");
    await userEvents.click(lastNameInput);
    await userEvents.keyboard("Doe");

    await userEvents.click(screen.getByText("Continue"));

    // ensure the form in its initial state is rendered
    await expect(
      screen.findByTestId("sid-form-initial-state")
    ).resolves.toBeInTheDocument();

    expect(mockBucket.set).toHaveBeenCalledWith({
      first_name: "John",
      last_name: "Doe",
    });

    // authenticate
    inputEmail("new@email.com");
    userEvents.click(screen.getByTestId("sid-form-initial-submit-button"));

    // expect the final step to be rendered, with the same ID as the starting user
    await expect(screen.findByText("Success!")).resolves.toBeInTheDocument();
    expect(screen.getByTestId("userId")).toHaveTextContent(anonymousUser.ID);
  });
});
