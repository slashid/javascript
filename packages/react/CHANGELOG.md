# @slashid/react

## 1.25.2

### Patch Changes

- a3477fd: Export Authenticating form state for internal use

## 1.25.1

### Patch Changes

- 0e79901: Update the Core SDK

## 1.25.0

### Minor Changes

- 421d0ac: Add error state for expired authentication attempts

## 1.24.6

### Patch Changes

- 23ca920: Update authenticating state copy to make it less confusing

## 1.24.5

### Patch Changes

- c587340: Cancel previous flow on retry
- 9c3cd06: Correctly pass the analyticsEnabled flag to the core SDK

## 1.24.4

### Patch Changes

- 46a3934: Fix the issue with polling going on after flow cancellation

## 1.24.3

### Patch Changes

- 8efe835: Display handles in authenticating state messages
- 8efe835: Add stable CSS class names to form icons

## 1.24.2

### Patch Changes

- 4e41b68: Add support for username handle type
- 4e41b68: Introduce the supportUrl config prop
- 4e41b68: Add special handling for the no password set error

## 1.24.1

### Patch Changes

- 25960c7: Prevent the person identified being fired twice

## 1.24.0

### Minor Changes

- 689a2cd: Introduce the anonymousUser property
- b1a394c: Support login with TOTP as an additional auth factor

## 1.23.0

### Minor Changes

- 6738884: Add support for anonymous users

## 1.22.2

### Patch Changes

- 5044585: Fix the versioning issue

## 1.22.1

### Patch Changes

- 4258c45: Use the primary color variable for Form loading states

## 1.22.0

### Minor Changes

- 555d6de: Add Apple as OIDC provider

## 1.21.0

### Minor Changes

- 0c17491: Add flex wrapper around img logo element

## 1.20.0

### Minor Changes

- d3b9a54: Add the `environment` prop to `<SlashIDProvider>` component

### Patch Changes

- fc8d2f1: Use alternative to Object.hasOwn()

## 1.19.0

### Minor Changes

- 79f9e00: Add `allowedHandleTypes` configuration option to password

### Patch Changes

- 480142a: Improve handling of OTP error & resend

## 1.18.1

### Patch Changes

- bb92b36: Trigger a render after performing MFA

## 1.18.0

### Minor Changes

- 4f256a6: Add the password authentication method and the corresponding recovery flow.

## 1.17.2

### Patch Changes

- 61c77e0: Gracefully fail when users have localStorage blocked

## 1.17.1

### Patch Changes

- c38b140: Update README.md with standard brand banner
- 0f7710a: CSRF protection for SSO

## 1.17.0

### Minor Changes

- d86d7b6: Add ServerThemeRoot to public API

## 1.16.6

### Patch Changes

- 25a820c: Invalid handles are no longer stored as part of storeLastHandle

## 1.16.5

### Patch Changes

- 64212fd: Fix the embedded types
- 64212fd: Update the package so that it does not depend on react primitives on npm

## 1.16.4

### Patch Changes

- Updated dependencies [21c2948]
  - @slashid/react-primitives@0.1.3

## 1.16.3

### Patch Changes

- Updated dependencies [0e2fb6b]
  - @slashid/react-primitives@0.1.2

## 1.16.2

### Patch Changes

- Updated dependencies [0e4746c]
  - @slashid/react-primitives@0.1.1

## 1.16.1

### Patch Changes

- 6527fe3: Update the core SDK dependency to 3.17.1
- c1cf068: Add the skeleton component. Expose the jump page
- Updated dependencies [c1cf068]
  - @slashid/react-primitives@0.1.0

## 1.16.0

### Minor Changes

- c1b0305: User analytics are now enabled by default

### Patch Changes

- 5de98fa: Update Vite to v4.5.0

## 1.15.1

### Patch Changes

- cdb4283: Make sure the loading/error indicators are not hidden with div:empty as some apps use by default.
- cdb4283: Limit the form logo height to 32px per design. Default to the SlashID logo in case an invalid logo is configured.

## 1.15.0

### Minor Changes

- 1d07d6d: Added the Form.Error primitive component to facilitate error UI customisation

### Patch Changes

- 3660cdf: Added a backward compatible Form.Initial.SSO section that encompasses both OIDC and SAML connections

## 1.14.1

### Patch Changes

- c5ecee8: Add Okta as an OIDC provider

## 1.14.0

### Minor Changes

- bba9671: Require @slashid/slashid@3.14.0 as peer

### Patch Changes

- a9c5f81: Add Dropdown Item docs
- 5423771: Improve the OTP code form to be more user friendly
- 5423771: Update text and icons for the OTP authenticating states
  Hide the retry section when the OTP code is being submitted
- 3d2a082: Fix the `storeLastHandle` functionality
- c663117: Fix GDPR dialog close button outline
  Fix Login form icon position
- 686b2c9: Fix styling of icons in the <Form> component

## 1.13.0

### Minor Changes

- e6498fa: Introduce the Slots API - compose your own <Form>

### Patch Changes

- 7c9b8b9: Fix styling of the dropdown in the <Form> component

## 1.12.0

### Minor Changes

- fde4fa1: Fix form spacing issues
- e567a8e: Improve GDPRConsentDialog usability

### Patch Changes

- 8727f5d: Adjust requireNecessaryCookies prop to behave as in the docs
- 9cd82ce: Fix out of sync consent settings
- cb23df7: Use a consistent naming strategy with uppercase acronyms
- 43012df: Refactored the hook to expose isLoading instead of the state variable

## 1.11.0

### Minor Changes

- 76e8f3f: Add renderLabel prop to \<OrganizationSwitcher />
- 214df7e: Add <GDPRConsentDialog>, useGdprConsent()
- 460cf89: fix: clear stale state before performing login
- 302157e: Use correct OIDC provider branding

## 1.10.1

### Patch Changes

- a3b7564: Added the otp_via_email method
- 4d47e4b: Update the core SDK dependency

## 1.10.0

### Minor Changes

- 5e8d505: Move middleware exports to root
- 4629fa8: Added the "label" option to OIDC factor config to enable overriding the UI label

## 1.9.0

### Minor Changes

- 9e4ae09: Move the theme props to the SlashIDProvider
- 433a8e4: Add the DynamicFlow component
- 1d0d64c: Add <OrganizationSwitcher>, useOrganizations()
- 1d0d64c: Add middleware concept, defaultOrganization middleware

## 1.8.3

### Patch Changes

- fff6df8: Remove JSX.Element type from

## 1.8.1

### Patch Changes

- c70fa86: Remove JSX.Element type from <SlashIDLoaded/>

## 1.8.0

### Minor Changes

- 02ea6e5: Add <SlashIDLoaded>, isLoading and isAuthenticated

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
