# Form composition API

The form composition API is a set of components that can be used to compose a form. It is designed to be used with the `Form` component.
The exposed wrappers documented below can be used to override the default form components. Only the components that are overridden will be replaced.
In addition to that, any components passed in without a wrapper will be ignored in the top level containers.

## Form.Footer

Overrides the footer, present in all states of the form.

## Form.Initial

Overrides the initial state of the form. Important: if you override the initial state, you must also override the submit button and the input controls. Otherwise the form will not render anything.

### Form.Initial.Submit

Overrides the submit button of the initial state of the form.

### Form.Initial.Controls

Overrides the input controls of the initial state of the form.

## Form.Authenticating

TODO - Overrides the authenticating state of the form (alternative loading state).

## Form.Error

TODO - Overrides the error state of the form (custom error messages).

## Form.Success

TODO - Override the final state of the form.
