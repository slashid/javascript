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
  "authenticating.back": "Back",
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
  "authenticating.otpInput": "OTP",
  "authenticating.otpInput.submit": "Submit",
  "success.title": "You are now authenticated!",
  "success.subtitle": "You can now close this page.",
  "error.title": "Something went wrong...",
  "error.subtitle":
    "There has been an error while submitting your form. Please try again.",
  "factor.webauthn": "Passkeys",
  "factor.otpViaSms": "OTP via SMS",
  "factor.emailLink": "Email link",
  "factor.smsLink": "SMS link",
  "validationError.otp": "Please enter the OTP code.",
  "validationError.email": "Please enter your email address.",
  "validationError.phoneNumber": "Please enter your phone number.",
  // KYC
  "kyc.mobile.end.title": "Upload was successful.",
  "kyc.mobile.end.description": "Please return to desktop.",
  "kyc.mobile.failure.generic.title": "Something went wrong",
  "kyc.mobile.failure.generic.description": "Please try again",
  "kyc.mobile.failure.upload_not_supported.title": "Upload not supported",
  "kyc.mobile.failure.upload_not_supported.description":
    "Please try with a different browser or device",
  // Technical message to alert the consumer
  "kyc.mobile.failure.invalid_state.title": "Invalid State",
  "kyc.mobile.failure.invalid_state.description":
    "Cannot render anything due to inconsistent state",
  "kyc.upload.mobile.empty.id_card.front":
    "Upload the front side of your ID card",
  "kyc.upload.mobile.empty.id_card.back":
    "Upload the back side of your ID card",
  "kyc.upload.mobile.empty.driver_license.front":
    "Upload the front side of your driver license",
  "kyc.upload.mobile.empty.driver_license.back":
    "Upload the back side of your driver license",
  "kyc.upload.mobile.empty.passport.front":
    "Upload the front side of your passport",
  "kyc.upload.mobile.empty.passport.back":
    "Upload the back side of your passport",
  "kyc.upload.mobile.empty.cta": "Upload",
  "kyc.upload.mobile.loading.message": "Checking image quality",
  "kyc.upload.mobile.failure.generic.title": "Cannot load image",
  "kyc.upload.mobile.failure.generic.description":
    "Please try with a different image",
  "kyc.upload.mobile.failure.quality.title": "Invalid Image",
  "kyc.upload.mobile.failure.quality.description":
    "Please try with a different image",
  "kyc.upload.mobile.failure.quality.detect_blur.title": "Image is too blurry",
  "kyc.upload.mobile.failure.quality.detect_blur.description":
    "Please try with a different image",
  "kyc.upload.mobile.failure.quality.detect_cutoff.title":
    "Document is not entirely visible",
  "kyc.upload.mobile.failure.quality.detect_cutoff.description":
    "Please try with a different image",
  "kyc.upload.mobile.failure.quality.document_detection.title":
    "Document not found",
  "kyc.upload.mobile.failure.quality.document_detection.description":
    "Please try with a different image",
  "kyc.upload.mobile.success.title": "Image looks good",
  "kyc.upload.mobile.upload.cta.continue": "Continue",
  "kyc.upload.mobile.upload.cta.again": "Upload again",
  "kyc.upload.mobile.title": "Your document",
  "kyc.upload.mobile.subtitle": "Upload the required images of your documents",
  "kyc.livephoto.mobile.upload.cta.continue": "Continue",
  "kyc.livephoto.mobile.upload.cta.again": "Upload again",
  "kyc.livephoto.mobile.empty": "Upload a selfie picture.",
  "kyc.livephoto.mobile.empty.cta": "Upload",
  "kyc.livephoto.mobile.loading.message": "Validating picture",
  "kyc.livephoto.mobile.failure.generic.title": "Cannot load image",
  "kyc.livephoto.mobile.failure.generic.description":
    "Please try with a different image",
  "kyc.livephoto.mobile.failure.validation.title": "An error occurred",
  "kyc.livephoto.mobile.failure.validation.description":
    "Please try with a different image",
  "kyc.livephoto.mobile.failure.validation.face_detection.title":
    "Face not detected",
  "kyc.livephoto.mobile.failure.validation.face_detection.description":
    "Please try with a different image",
  "kyc.livephoto.mobile.success.title": "Image looks good",
  "kyc.livephoto.mobile.title": "Selfie Check",
  "kyc.livephoto.mobile.subtitle":
    "Upload a selfie picture to confirm your identity.",
  // gdpr
  "gdpr.dialog.title": "We value your privacy",
  "gdpr.dialog.subtitle":
    "We use cookies to improve your experience. Learn more in our Cookie policy.",
  "gdpr.consent.necessary.title": "Necessary cookies",
  "gdpr.consent.necessary.description":
    "This is a detailed description of necessary cookies. Lorem ipsum dolor sit amet consectetur. Praesent malesuas massa praesent at placerat leo orci amet. Commodo eget eget montes amet viverra faucibus vel. Sitiori vestibulum ullamcorper.",
  "gdpr.consent.analytics.title": "Analytics",
  "gdpr.consent.analytics.description":
    "This is a detailed description of analytics cookies. Lorem ipsum dolor sit amet consectetur. Praesent malesuas massa praesent at placerat leo orci amet. Commodo eget eget montes amet viverra faucibus vel. Sitiori vestibulum ullamcorper.",
  "gdpr.consent.marketing.title": "Marketing",
  "gdpr.consent.marketing.description":
    "This is a detailed description of marketing cookies. Lorem ipsum dolor sit amet consectetur. Praesent malesuas massa praesent at placerat leo orci amet. Commodo eget eget montes amet viverra faucibus vel. Sitiori vestibulum ullamcorper.",
};
