export type TextConfig = typeof TEXT;
export type TextConfigKey = keyof TextConfig;

export const TEXT = {
  "": "NYI",
  "footer.branding": "Top-tier security by SlashID",
  "initial.title": "Welcome",
  "initial.subtitle": "Sign in to your account",
  "initial.oidc": "Sign in with",
  "initial.authenticationMethod": "Authentication method",
  "initial.handle.email": "Email address",
  "initial.handle.phone": "Phone number",
  "initial.handle.phone.email": "Type your email",
  "initial.handle.phone.placeholder": "Type your phone number",
  "initial.submit": "Continue",
  "initial.divider": "or",
  "authenticating.retryPrompt": "Did not work?",
  "authenticating.retry": "Retry",
  "authenticating.message.webauthn":
    "If you are registering for the first time, you will receive an email to verify your email address.",
  "authenticating.title.webauthn":
    "You'll be prompted to validate your login via your device",
  "authenticating.message.emailLink":
    "We have sent you a link via email. Follow the link provided to complete your registration.",
  "authenticating.title.emailLink": "Check your email",
  "authenticating.message.smsLink":
    "We have sent you a link via text. Follow the link provided to complete your registration.",
  "authenticating.title.smsLink": "Check your phone",
  "authenticating.message.smsOtp":
    "We have sent you a code via text. Please insert it here.",
  "authenticating.title.smsOtp": "Check your phone",
  "authenticating.message.oidc":
    "Please follow the instructions in the login screen from your SSO provider.",
  "authenticating.title.oidc": "Sign in with ",
  "factor.webauthn": "Webauthn",
  "factor.otpViaSms": "OTP via SMS",
  "factor.emailLink": "Email link",
  "factor.smsLink": "SMS link",
};
