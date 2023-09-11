# Form composition API

The form composition API is a set of components that can be used to compose a form. It is designed to be used with the `Form` component.
The exposed wrappers documented below can be used to override the default form components. Only the components that are overridden will be replaced.
In addition to that, any components passed in without a wrapper will be ignored in the top level containers.

## Slot

The `Slot` component is used to pass in components to fill the named layout slots. The parent component will decide how to render the components passed in.
The names of these slots will be documented in the corresponding container components. Slots are not responsible for sharing any data with their children.

```tsx
<Form>
  <Slot name="initial">
    <h1>Any component can be rendered here</h1>
    <Form.Initial.Controls /> // renders the default controls, no children passed
    in
    <Form.Initial.Submit>
      <button>My own button</button>
    </Form.Initial.Submit>
  </Slot>
  <Slot name="error">
    Replace the error state (might have more slots of its own)
  </Slot>
  <Slot name="footer">Always present</Slot>
</Form>
```

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
