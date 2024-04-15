import { Email, Chat, Circle, Spinner } from "@slashid/react-primitives";

export const Loader = () => (
  <Circle variant="primary">
    <Spinner />
  </Circle>
);

export const EmailIcon = () => (
  <Circle variant="primary">
    <Email />
  </Circle>
);

export const SmsIcon = () => (
  <Circle variant="primary">
    <Chat />
  </Circle>
);
