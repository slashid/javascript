

/* export const logo = undefined; */

export const logo =
  "https://seeklogo.com/images/R/react-logo-7B3CE81517-seeklogo.com.png";

export const factors = [
  { method: "email_link" },
  { method: "webauthn" },
  /* { method: "otp_via_sms" }, */
  { method: "oidc", options: { provider: "google" } },
  { method: "oidc", options: { provider: "github" } },
];

export const theme = "dark";

export const text = {
  "initial.subtitle": "Please sign in",
};
