import { useConfiguration } from "../../hooks/use-configuration";
import { sprinkles } from "../../theme/sprinkles.css";
import { LinkButton } from "../button/link-button";
import { Circle } from "../spinner/circle";
import { Text } from "../text";
import { ErrorState } from "./flow";

const ErrorIcon = () => (
  <Circle variant="red">
    <svg
      width="5"
      height="20"
      viewBox="0 0 5 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5 0C3.32843 1.19209e-07 4 0.671573 4 1.5L4 11.5C4 12.3284 3.32843 13 2.5 13C1.67157 13 1 12.3284 1 11.5L1 1.5C1 0.671573 1.67157 -1.19209e-07 2.5 0Z"
        fill="white"
      />
      <path
        d="M4.5 18C4.5 19.1046 3.60457 20 2.5 20C1.39543 20 0.5 19.1046 0.5 18C0.5 16.8954 1.39543 16 2.5 16C3.60457 16 4.5 16.8954 4.5 18Z"
        fill="white"
      />
    </svg>
  </Circle>
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
      <Text
        as="h1"
        t="error.title"
        variant={{ size: "2xl-title", weight: "bold" }}
      />
      <Text
        as="h2"
        t="error.subtitle"
        variant={{ color: "contrast", weight: "semibold" }}
      />
      <ErrorIcon />
    </article>
  );
};
