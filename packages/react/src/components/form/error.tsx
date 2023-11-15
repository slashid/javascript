import { Button, LinkButton } from "@slashid/react-primitives";
import { sprinkles } from "@slashid/react-primitives/src/theme/sprinkles.css";
import { useConfiguration } from "../../hooks/use-configuration";
import { Circle } from "../spinner/circle";
import { Text } from "../text";
import { TextConfigKey } from "../text/constants";
import { ErrorState } from "./flow";
import { Errors } from "@slashid/slashid";
import { Children } from "react";
import { useInternalFormContext } from "./internal-context";

const ErrorIcon = () => (
  <Circle variant="red" shouldAnimate={false}>
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

type ErrorType = "response" | "rateLimit" | "unknown";

function getErrorType(error: Error): ErrorType {
  if (Errors.isResponseError(error)) {
    return "response";
  }

  if (Errors.isRateLimitError(error)) {
    return "rateLimit";
  }

  return "unknown";
}

function mapErrorTypeToText(errorType: ErrorType): TextConfigKey {
  switch (errorType) {
    case "rateLimit":
      return "error.subtitle.rateLimit";
    default:
      return "error.subtitle";
  }
}

type Props = {
  flowState: ErrorState;
};

type ErrorProps = {
  context: ErrorState["context"];
  retry: () => void;
  cancel: () => void;
};

type ErrorTemplateProps = {
  children?: React.ReactNode | (({ context }: ErrorProps) => React.ReactNode);
};

export const Error = ({ children }: ErrorTemplateProps) => {
  const { flowState } = useInternalFormContext();

  if (flowState?.status !== "error") return null;

  if (typeof children === "function") {
    return (
      <div data-testid="sid-form-error-function">
        {children({
          context: flowState.context,
          retry: flowState.retry,
          cancel: flowState.cancel,
        })}
      </div>
    );
  }

  if (Children.count(children) > 0)
    return <div data-testid="sid-form-error-children">{children}</div>;

  return <ErrorImplementation flowState={flowState} />;
};

Error.displayName = "Form.Error";

const ErrorImplementation: React.FC<Props> = ({ flowState }) => {
  const { text } = useConfiguration();

  const errorType = getErrorType(flowState.context.error);

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
        t={mapErrorTypeToText(errorType)}
        variant={{ color: "contrast", weight: "semibold" }}
      />
      <ErrorIcon />
      <Button
        type="submit"
        variant="primary"
        testId="sid-form-error-retry-button"
        onClick={() => flowState.retry()}
      >
        {text["error.retry"]}
      </Button>
    </article>
  );
};
