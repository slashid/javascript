import { useSlashID } from "@slashid/react";
import { PersonHandleType } from "@slashid/slashid";
import { useState } from "react";
import {
  AreaLoader,
  Form,
  FormRow,
  FormSection,
  Inline,
  Logo,
  Stack,
  TextField,
} from "design-system";
import { useFormo, validators } from "@buildo/formo";
import { failure, success } from "@buildo/formo/lib/Result";

export function Login() {
  const [loading, setLoading] = useState(false);
  const { logIn } = useSlashID();

  const { fieldProps, handleSubmit, formErrors } = useFormo(
    {
      initialValues: {
        email: "",
      },
      fieldValidators: () => ({
        email: validators.inSequence(
          validators.minLength(1, "The email address cannot be empty"),
          validators.validEmail("Invalid email address")
        ),
      }),
    },
    {
      onSubmit: ({ email }) => {
        setLoading(true);
        return logIn({
          handle: { value: email, type: "email_address" },
          factor: { method: "email_link" },
        }).then(
          () => {
            setLoading(false);
            return success(null);
          },
          () => {
            setLoading(false);
            return failure(
              "Something went wrong while logging in. Please retry later."
            );
          }
        );
      },
    }
  );

  return (
    <Stack space={40}>
      <Inline space={0} align="center">
        <Logo height={60} />
      </Inline>
      <Form
        submitButton={{
          onPress: handleSubmit,
          label: "Login",
        }}
        error={formErrors}
      >
        <FormSection>
          <FormRow>
            <TextField
              {...fieldProps("email")}
              name="email"
              label="Email"
              placeholder="Your email address"
              disabled={loading}
            />
          </FormRow>
        </FormSection>
        {loading && (
          <AreaLoader message="Please check your email to complete login" />
        )}
      </Form>
    </Stack>
  );
}
