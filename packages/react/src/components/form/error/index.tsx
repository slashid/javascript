import { Children } from "react";
import { Errors } from "@slashid/slashid";
import {
  Button,
  LinkButton,
  Circle,
  Exclamation,
  sprinkles,
} from "@slashid/react-primitives";
import { clsx } from "clsx";

import { useConfiguration } from "../../../hooks/use-configuration";
import { Text } from "../../text";
import { TextConfigKey } from "../../text/constants";
import { ErrorState } from "../flow";
import { useInternalFormContext } from "../internal-context";
import {
  isNoPasswordSetError,
  isNonReachableHandleTypeError,
} from "../../../domain/errors";

import * as styles from "./error.css";

const ErrorIcon = () => (
  <Circle variant="red" shouldAnimate={false}>
    <Exclamation />
  </Circle>
);

type ErrorType =
  | "response"
  | "rateLimit"
  | "recoverNonReachableHandleType"
  | "noPasswordSet"
  | "unknown";

function getErrorType(error: Error): ErrorType {
  if (Errors.isResponseError(error)) {
    return "response";
  }

  if (Errors.isRateLimitError(error)) {
    return "rateLimit";
  }

  if (isNonReachableHandleTypeError(error)) {
    return "recoverNonReachableHandleType";
  }

  if (isNoPasswordSetError(error)) {
    return "noPasswordSet";
  }

  return "unknown";
}

function mapErrorTypeToText(errorType: ErrorType): {
  title: TextConfigKey;
  description: TextConfigKey;
} {
  switch (errorType) {
    case "rateLimit":
      return {
        title: "error.title.rateLimit",
        description: "error.subtitle.rateLimit",
      };
    case "recoverNonReachableHandleType":
      return {
        title: "error.title.recoverNonReachableHandleType",
        description: "error.subtitle.recoverNonReachableHandleType",
      };
    case "noPasswordSet":
      return {
        title: "error.title.noPasswordSet",
        description: "error.subtitle.noPasswordSet",
      };
    default:
      return {
        title: "error.title",
        description: "error.subtitle",
      };
  }
}

function ContactSupportPrompt() {
  const { text, supportURL } = useConfiguration();

  if (!supportURL) {
    return null;
  }

  return (
    <div
      className={clsx("sid-form-error-contact-support", styles.supportPrompt)}
      data-testid="sid-form-error-support-prompt"
    >
      <span>{text["error.contactSupport.prompt"]}</span>
      <a
        className={styles.supportCta}
        target="_blank"
        href={supportURL}
        rel="noreferrer"
      >
        {text["error.contactSupport.cta"]}
      </a>
    </div>
  );
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
  const { title, description } = mapErrorTypeToText(errorType);

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
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }} />
      <Text
        as="h2"
        t={description}
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
      <ContactSupportPrompt />
    </article>
  );
};
