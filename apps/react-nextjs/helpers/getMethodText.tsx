const getMethodText = (method: string) => {
  switch (method) {
    case "webauthn":
      return "You'll be prompted to validate your login via your device! If you are registering for the first time, you will receive an email to verify your email address.";
    case "webauthn_via_sms":
      return "You'll be prompted to validate your login via your device!";
    case "webauthn_via_email":
    case "email_link":
    default:
      return "We have sent you a link via email. Follow the link provided to complete your registration.";
    case "sms_link":
      return "We have sent you a link via text. Follow the link provided to complete your registration.";
    case "otp_via_sms":
      return "We sent you a code via text. Please insert it.";
  }
};

export default getMethodText;
