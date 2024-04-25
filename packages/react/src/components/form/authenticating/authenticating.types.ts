import { AuthenticatingState } from "../flow";

export type Props = {
  flowState: AuthenticatingState;
  performLogin: () => void;
};
