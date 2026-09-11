---
"@slashid/react": minor
---

`DynamicFlow` gains an `attemptSSO` prop. With it on, the `hook` factor is submitted for email identifiers before `getFactors` is consulted, so the organization's `identify_user` webhook can pick the factor (one-step SSO). When the API resolves nothing, the flow continues with `getFactors` for the same identifier. Requires `@slashid/slashid` with `HookFactorUnresolvedError`.
