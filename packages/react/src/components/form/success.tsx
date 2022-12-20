import { clsx } from "clsx";
import { SuccessState } from "./flow";
import { Text } from "../text";
import { centered, sprinkles } from "../../theme/sprinkles.css";
import * as styles from "./success.css";

const CheckIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 16 16"
    height="55px"
    width="55px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
  </svg>
);

type Props = {
  flowState: SuccessState;
};

export const Success: React.FC<Props> = () => {
  return (
    <article data-testid="sid-form-success-state">
      <Text as="h1" t="success.title" variant={{ size: "2xl-title" }} />
      <Text as="h2" t="success.subtitle" variant={{ color: "contrast" }} />
      <div
        className={clsx(styles.check, sprinkles({ marginY: "12" }), centered)}
      >
        <CheckIcon />
      </div>
    </article>
  );
};
