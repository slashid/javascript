import { clsx } from "clsx";
import { ErrorState } from "./flow";
import { Text } from "../text";
import * as styles from "./error.css";
import { centered, sprinkles } from "../../theme/sprinkles.css";
import { LinkButton } from "../button/link-button";
import { useConfiguration } from "../../hooks/use-configuration";

const ErrorIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="55px"
    width="55px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
  </svg>
);

type Props = {
  flowState: ErrorState;
};

export const Error: React.FC<Props> = ({ flowState }) => {
  const { text } = useConfiguration();

  return (
    <article data-testid="sid-form-error-state">
      <LinkButton
        className={sprinkles({ marginBottom: "4" })}
        testId="sid-form-authenticating-cancel-button"
        variant="back"
        onClick={() => flowState.cancel()}
      >
        {text["authenticating.back"]}
      </LinkButton>
      <Text as="h1" t="error.title" variant={{ size: "2xl-title" }} />
      <Text as="h2" t="error.subtitle" variant={{ color: "contrast" }} />
      <div
        className={clsx(styles.error, sprinkles({ marginY: "12" }), centered)}
      >
        <ErrorIcon />
      </div>
    </article>
  );
};
