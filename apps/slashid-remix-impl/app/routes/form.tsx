import { ConfigurationProvider, type Factor, Form } from "@slashid/remix";

const factors: Factor[] = [
  { method: "email_link" },
  { method: "otp_via_email" },
  { method: "password" },
];

/**
 * This page is used for e2e tests only.
 */
export default function FormPage() {
  return (
    <div style={{ width: 390 }}>
      <ConfigurationProvider factors={factors}>
        <Form onSuccess={() => console.log("Logged in!")} />
      </ConfigurationProvider>
    </div>
  );
}
