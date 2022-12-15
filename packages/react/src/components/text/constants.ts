export type TextConfig = typeof TEXT;
export type TextConfigKey = keyof TextConfig;

export const TEXT = {
  "": "NYI",
  "initial.title": "Welcome",
  "initial.subtitle": "Sign in to your account",
  "initial.oidc": "Sign in with",
  "initial.authenticationMethod": "Authentication method",
  "initial.handle.email": "Email address",
  "initial.handle.phone": "Phone number",
  "initial.handle.phone.email": "Type your email",
  "initial.handle.phone.placeholder": "Type your phone number",
  "initial.submit": "Continue",
  "factor.webauthn": "Webauthn",
  "factor.otpViaSms": "OTP via SMS",
  "factor.emailLink": "Email link",
  "factor.smsLink": "SMS link",
};
