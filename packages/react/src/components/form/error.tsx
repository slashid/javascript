import { Children } from "react";
import { Errors } from "@slashid/slashid";
import {
  Button,
  LinkButton,
  Circle,
  Exclamation,
  sprinkles,
} from "@slashid/react-primitives";

import { useConfiguration } from "../../hooks/use-configuration";
import { Text } from "../text";
import { TextConfigKey } from "../text/constants";
import { ErrorState } from "./flow.types";
import { useInternalFormContext } from "./internal-context";

const ErrorIcon = () => (
  <Circle variant="red" shouldAnimate={false}>
    <Exclamation />
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
