export type TextConfig = typeof TEXT;
export type TextConfigKey = keyof TextConfig;

export const TEXT = {
  "": "NYI",
  "footer.branding": "Top-tier security by SlashID",
  "initial.title": "Welcome to SlashID",
  "initial.subtitle": "Sign in to your account",
  "initial.oidc": "Sign in with",
  "initial.sso": "Sign in with",
  "initial.authenticationMethod": "Authentication method",
  "initial.handle.email": "Email",
  "initial.handle.phone": "Phone",
  "initial.handle.username": "Username",
  "initial.handle.email.placeholder": "Type your email",
  "initial.handle.phone.placeholder": "Type your phone number",
  "initial.handle.username.placeholder": "Type your username",
  "initial.submit": "Continue",
  "initial.divider": "or",
  "authenticating.password.label": "Password",
  "authenticating.password.placeholder": "Type your password",
  "authenticating.passwordConfirm.label": "Confirm password",
  "authenticating.retryPrompt": "Didn’t receive the message?",
  "authenticating.retry": "Resend",
  "authenticating.back": "Back",
  "authenticating.initial.password.title": "Log in with a password.",
  "authenticating.initial.password.message.email":
    "If you are using a password for the first time, you will receive an email to verify your email address.",
  "authenticating.initial.password.message.phone":
    "If you are using a password for the first time, you will receive a message to verify your phone number.",
  "authenticating.setPassword.title": "Create your password",
  "authenticating.setPassword.message": "Define a secure password to sign up.",
  "authenticating.setPassword.validation.required": "Password is required",
  "authenticating.setPassword.validation.mismatch": "Passwords should match",
  "authenticating.setPassword.validation.incorrect":
    "Incorrect handle or password",
  "authenticating.setPassword.validation.length": "8-256 characters required",
  "authenticating.setPassword.validation.password_variants":
    "Contains word 'password'",
  "authenticating.setPassword.validation.admin_variants":
    "Contains word 'admin'",
  "authenticating.setPassword.validation.user_variants": "Contains word 'user'",
  "authenticating.setPassword.validation.alphanumeric_sequences_1":
    "Illegal sequence: {{ILLEGAL_SEQUENCE}}",
  "authenticating.setPassword.validation.alphanumeric_sequences_2":
    "Illegal sequence: {{ILLEGAL_SEQUENCE}}",
  "authenticating.setPassword.validation.numeric_sequences_ascending":
    "Illegal sequence: {{ILLEGAL_SEQUENCE}}",
  "authenticating.setPassword.validation.numeric_subsequences_ascending":
    "Illegal sequence: {{ILLEGAL_SEQUENCE}}",
  "authenticating.setPassword.validation.numeric_sequences_descending":
    "Illegal sequence: {{ILLEGAL_SEQUENCE}}",
  "authenticating.setPassword.validation.numeric_subsequences_descending":
    "Illegal sequence: {{ILLEGAL_SEQUENCE}}",
  "authenticating.setPassword.validation.common_password_xkcd":
    "Common password",
  "authenticating.verifyPassword.title": "Enter your password",
  "authenticating.verifyPassword.message": "Type your password to sign in.",
  "authenticating.verifyPassword.recover.prompt": "Forgot password?",
  "authenticating.verifyPassword.recover.cta": "Reset",
  "authenticating.recoverPassword.title.email": "Check your email",
  "authenticating.recoverPassword.message.email":
    "We have sent an email to {{EMAIL_ADDRESS}} with instructions for resetting your password. This email can take a few minutes to arrive, make sure to check your spam.",
  "authenticating.recoverPassword.title.phone": "Check your phone",
  "authenticating.recoverPassword.message.phone":
    "We have sent a message to {{PHONE_NUMBER}} with instructions for resetting your password. This message can take a few minutes to arrive, make sure to check your spam.",
  "authenticating.password.submit": "Continue",
  "authenticating.submitting.password.title": "Logging you in...",
  "authenticating.submitting.password.message": "This may take some time.",
  "authenticating.initial.totp.title": "Log in with TOTP",
  "authenticating.initial.totp.message":
    "If this is your first time logging with TOTP, we will generate a secret for your Authenticator app.",
  "authenticating.registerAuthenticator.totp.title": "Set up One Time Password",
  "authenticating.registerAuthenticator.totp.message":
    "Scan the QR code with an authenticator app to set up your One Time Password.",
  "authenticating.registerAuthenticator.totp.prompt": "Can't scan?",
  "authenticating.registerAuthenticator.totp.cta": "Set up with a code",
  "authenticating.input.totp.cta": "Use recovery code",
  "authenticating.input.totp.title": "Enter authentication code",
  "authenticating.input.totp.message":
    "Enter the 6-digit code displayed in your authenticator app.",
  "authenticating.saveRecoveryCodes.totp.title": "Save your recovery codes",
  "authenticating.saveRecoveryCodes.totp.message":
    "Use these codes to authenticate if you lose access to your device. Store them somewhere safe.",
  "authenticating.continue": "Continue",
  "authenticating.confirm": "Confirm",
  "authenticating.downloadCodes": "Download codes",
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
  "authenticating.message.emailOtp":
    "We have sent you a code via email. Please insert it here.",
  "authenticating.title.emailOtp": "Check your email",
  "authenticating.submitting.message.emailOtp": "We are verifying the code.",
  "authenticating.submitting.title.emailOtp": "Please wait",
  "authenticating.retry.message.emailOtp": "We are resending the OTP code...",
  "authenticating.retry.title.emailOtp": "Please wait",
  "authenticating.message.smsOtp":
    "We have sent you a code via text. Please insert it here.",
  "authenticating.title.smsOtp": "Check your phone",
  "authenticating.submitting.message.smsOtp": "We are verifying the code.",
  "authenticating.submitting.title.smsOtp": "Please wait",
  "authenticating.retry.message.smsOtp": "We are resending the OTP code...",
  "authenticating.retry.title.smsOtp": "Please wait",
  "authenticating.message.oidc":
    "Please follow the instructions in the login screen from your SSO provider.",
  "authenticating.title.oidc": "Sign in with ",
  "authenticating.otpInput": "OTP",
  "authenticating.otpInput.submit": "Submit",
  "authenticating.otpInput.submit.error": "Please enter a valid code",
  "success.title": "You are now authenticated!",
  "success.subtitle": "You can now close this page.",
  "error.title": "Something went wrong...",
  "error.subtitle":
    "There has been an error while submitting your form. Please try again.",
  "error.title.rateLimit": "Too many attempts...",
  "error.subtitle.rateLimit":
    "Your request has been rate limited. Please try again later.",
  "error.title.recoverNonReachableHandleType": "Cannot reset password",
  "error.subtitle.recoverNonReachableHandleType":
    "Please use an email address or a phone number to reset your password.",
  "error.title.noPasswordSet": "No password set",
  "error.subtitle.noPasswordSet":
    "Contact support to set a password or log in with your email or phone number.",
  "error.retry": "Try again",
  "error.retry.rateLimit": "Try again",
  "error.retry.noPasswordSet": "Go back to login",
  "error.retry.recoverNonReachableHandleType": "Go back to login",
  "error.contactSupport.prompt": "Need help?",
  "error.contactSupport.cta": "Contact support",
  "factor.webauthn": "Passkeys",
  "factor.otpViaSms": "OTP via SMS",
  "factor.otpViaEmail": "OTP via email",
  "factor.emailLink": "Email link",
  "factor.smsLink": "SMS link",
  "factor.password": "Password",
  "validationError.otp": "Please enter the OTP code.",
  "validationError.email": "Please enter your email address.",
  "validationError.phoneNumber": "Please enter your phone number.",
  "validationError.username": "Please enter a valid username.",
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
  "org.switcher.label": "Organization",
  // gdpr
  "gdpr.dialog.title": "We value your privacy",
  "gdpr.dialog.subtitle":
    "We use cookies to improve your experience. Learn more in our Cookie policy.",
  "gdpr.consent.necessary.title": "Necessary cookies",
  "gdpr.consent.necessary.description":
    "Cookies that are essential to provide the service you have requested or which are required to comply with legal requirements, like data protection laws.",
  "gdpr.consent.analytics.title": "Analytics",
  "gdpr.consent.analytics.description":
    "Cookies that are used for analytics or performance measurement purposes, like counting the number of unique visitors to our site, how long you stay on the site, and what parts of our site you visit.",
  "gdpr.consent.marketing.title": "Marketing",
  "gdpr.consent.marketing.description":
    "Cookies that are used to display advertising personalised to you (whether on or off our site) based on your browsing and profile.",
  "gdpr.consent.retargeting.title": "Retargeting",
  "gdpr.consent.retargeting.description":
    "Cookies that are used to display advertising personalised to you (whether on or off our site) based on your browsing and profile.",
  "gdpr.consent.tracking.title": "Tracking",
  "gdpr.consent.tracking.description":
    "Cookies that track your online behaviour, such as clicks, preferences, device specifications, location, and search history. This data helps in targeted advertising and gathering website analytics.",
  "gdpr.dialog.error.title": "Oops!",
  "gdpr.dialog.error.subtitle": "Looks like something went wrong...",
  // deprecated keys
  /**
   * @deprecated Use 'initial.handle.email.placeholder' instead
   */
  "initial.handle.phone.email": "",
};
