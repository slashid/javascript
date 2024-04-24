import { Email, Chat, Circle, Spinner } from "@slashid/react-primitives";

export const Loader = () => (
  <Circle variant="primary" testId="sid-loader-icon">
    <Spinner />
  </Circle>
);

export const EmailIcon = () => (
  <Circle variant="primary" testId="sid-email-icon">
    <Email />
  </Circle>
);

export const SmsIcon = () => (
  <Circle variant="primary" testId="sid-sms-icon">
    <Chat />
  </Circle>
);
