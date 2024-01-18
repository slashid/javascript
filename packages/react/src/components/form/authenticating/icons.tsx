import {
  Email,
  Chat,
} from "../../../../../react-primitives/src/components/icon";
import { Circle } from "../../../../../react-primitives/src/components/spinner/circle";
import { Spinner } from "../../../../../react-primitives/src/components/spinner/spinner";

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
