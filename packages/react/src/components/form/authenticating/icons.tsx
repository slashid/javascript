import { Email, Chat, Circle, Spinner } from "@slashid/react-primitives";

export const Loader = () => (
  <Circle>
    <Spinner />
  </Circle>
);

export const EmailIcon = () => (
  <Circle>
    <Email />
  </Circle>
);

export const SmsIcon = () => (
  <Circle>
    <Chat />
  </Circle>
);
