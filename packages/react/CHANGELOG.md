# @slashid/react

## 1.7.0

### Minor Changes

- 0e02668: Increase the required @slashid/slashid peer dependency version to 3.9.0. and add the AzureAD OIDC provider

## 1.6.3

### Patch Changes

- c386900: Make sure the User options are inherited from the SDK

## 1.6.2

### Patch Changes

- 8af4be9: Make sure the form stays in sync with the dynamic config

## 1.6.1

### Patch Changes

- a08bd1c: Make sure the form reacts properly to dynamic configuration

## 1.6.0

### Minor Changes

- 8f13b41: Add the "initialToken" prop to the SlashIDProvider

## 1.5.4

### Patch Changes

- 092f021: Adjust wording to more user-friendly (WebAuthn -> Passkeys)
- 6e8e9cc: Added a configuration option for enabling the Analytics API

## 1.5.3

### Patch Changes

- d496aa1: Add config to hide branding banner

## 1.5.2

### Patch Changes

- 23c3445: Make the package public

## 1.5.1

### Patch Changes

- 6142540: Use sans-serif as a default font
- ae032a7: Reduce CSS bundle size - exclude Inter font

## 1.5.0

### Minor Changes

- ca4fc56: Create <MultiFactorAuth> and <StepUpAuth> components

## 1.4.0

### Minor Changes

- 4cf8882: Create <MFA /> component for immediate Multi-Factor Authentication
- 83f4d83: Extend <LoggedIn> API - add `withFactorMethods` prop to specify required authentication factor methods.

## 1.3.1

### Patch Changes

- 38c54bf: Fix issue with last handle on SSR, bump Core SDK
- d8bd533: Fix styles for input autofill on WebKit browsers

## 1.3.0

### Minor Changes

- fd3853e: Add new config property `storeLastHandle` (boolean, defaults to `false`) to enable Form autofilling with previously used handle stored in localStorage.

## 1.2.1

### Patch Changes

- cf33415: Render divider only when both OIDC and non-OIDC factors are present.
- d6f8e2b: Fix rendering logic in <LoggedIn /> and <LoggedOut />

## 1.2.0

### Minor Changes

- 70e685f: Add onSuccess callback prop to <Form /> component

### Patch Changes

- c73ad11: Added validation for <Form /> component inputs (email, phone number, OTP code)

## 1.1.0

### Minor Changes

- 153fa4c: Added the Groups component

### Patch Changes

- 8b71da1: Set `box-sizing: border-box` on <Form/>
- cd15f0c: Bundle fonts CSS files with <Form />

## 1.0.0

### Major Changes

- 51eb920: Upgrade the core SDK dependency to @slashid/slashid 3.0.0.

## 0.4.0

### Minor Changes

- e0e6949: Expose the SlashID SDK constructor options in the SlashIDProvider

## 0.3.0

### Minor Changes

- 910a8c5: Added the theme config prop

## 0.2.0

### Minor Changes

- db50139: Expose the authentication form component

### Patch Changes

- 757d7d9: Make the package private

## 0.1.3

### Patch Changes

- 1fe9d8e: Fix the readme example

## 0.1.2

### Patch Changes

- d0145d6: Prepare for public release

## 0.1.1

### Patch Changes

- 55917b6: Make the package public

## 0.1.0

### Minor Changes

- f14f357: Exposed the SDK state and components for rendering based on user state

### Patch Changes

- 7d3f673: Added unit tests

## 0.0.8

### Patch Changes

- 399ee1c: React SDK will now sync its state by listening to the core SDK events

## 0.0.7

### Patch Changes

- 6402664: Exposed the Factor type to enable autocomplete of logIn parameters

## 0.0.6

### Patch Changes

- 1ce72a4: Sync the state so that the sid value is updated

## 0.0.5

### Patch Changes

- cf5b3b9: Implemented a state machine to control the SDK lifecycle

## 0.0.4

### Patch Changes

- 60eb247: Fixed the incorrect casing in docs and exposed the correctly cased function names

## 0.0.3

### Patch Changes

- 19e4cc5: Added the NPM automatiom access token to the workflow

## 0.0.2

### Patch Changes

- 0ecab86: Documenting the publishing workflow

## 0.0.1

### Patch Changes

- 84f1758: Testing the changelog
