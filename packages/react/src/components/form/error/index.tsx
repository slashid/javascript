import { Children, ComponentProps, useEffect, useState } from "react";
import { Errors } from "@slashid/slashid";
import {
  Button,
  LinkButton,
  Circle,
  Exclamation,
  sprinkles,
  Divider,
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
import { Retry, RetryPolicy } from "../../../domain/types";

type ErrorIconProps = {
  variant?: ComponentProps<typeof Circle>["variant"];
};

const ErrorIcon = ({ variant = "red" }: ErrorIconProps) => (
  <Circle
    variant={variant}
    shouldAnimate={false}
    className="sid-form-error-icon"
  >
    <Exclamation />
  </Circle>
);

type ErrorType =
  | "response"
  | "rateLimit"
  | "recoverNonReachableHandleType"
  | "noPasswordSet"
  | "timeout"
  | "selfRegistrationNotAllowed"
  | "signUpAwaitingApproval"
  | "signInAwaitingApproval"
  | "unknown";

/**
 * These surface as errors, but are semantically different from
 * failed flow scenarios, so we need to distinguish them in the UI.
 */
const NEUTRAL_ERRORS: ErrorType[] = [
  "selfRegistrationNotAllowed",
  "signUpAwaitingApproval",
  "signInAwaitingApproval",
];

async function getErrorType(error: Error): Promise<ErrorType> {
  if (await Errors.isTimeoutError(error)) {
    return "timeout";
  }

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

  if (Errors.isSelfRegistrationNotAllowedError(error)) {
    return "selfRegistrationNotAllowed";
  }

  if (Errors.isSignUpAwaitingApprovalError(error)) {
    return "signUpAwaitingApproval";
  }

  if (Errors.isSignInAwaitingApprovalError(error)) {
    return "signInAwaitingApproval";
  }

  return "unknown";
}

function mapErrorTypeToText(errorType: ErrorType): {
  title: TextConfigKey;
  description: TextConfigKey;
  retry: TextConfigKey;
} {
  switch (errorType) {
    case "timeout":
      return {
        title: "error.title.authenticationExpired",
        description: "error.subtitle.authenticationExpired",
        retry: "error.retry.authenticationExpired",
      };
    case "rateLimit":
      return {
        title: "error.title.rateLimit",
        description: "error.subtitle.rateLimit",
        retry: "error.retry.rateLimit",
      };
    case "recoverNonReachableHandleType":
      return {
        title: "error.title.recoverNonReachableHandleType",
        description: "error.subtitle.recoverNonReachableHandleType",
        retry: "error.retry.recoverNonReachableHandleType",
      };
    case "noPasswordSet":
      return {
        title: "error.title.noPasswordSet",
        description: "error.subtitle.noPasswordSet",
        retry: "error.retry.noPasswordSet",
      };
    case "selfRegistrationNotAllowed":
      return {
        title: "error.title.selfRegistrationNotAllowed",
        description: "error.subtitle.selfRegistrationNotAllowed",
        retry: "error.retry.selfRegistrationNotAllowed",
      };
    case "signUpAwaitingApproval":
      return {
        title: "error.title.signUpAwaitingApproval",
        description: "error.subtitle.signUpAwaitingApproval",
        retry: "error.retry.signUpAwaitingApproval",
      };
    case "signInAwaitingApproval":
      return {
        title: "error.title.signInAwaitingApproval",
        description: "error.subtitle.signInAwaitingApproval",
        retry: "error.retry.signInAwaitingApproval",
      };
    default:
      return {
        title: "error.title",
        description: "error.subtitle",
        retry: "error.retry",
      };
  }
}

function mapErrorTypeToRetryPolicy(errorType: ErrorType): RetryPolicy {
  switch (errorType) {
    case "recoverNonReachableHandleType":
    case "noPasswordSet":
    case "selfRegistrationNotAllowed":
    case "signUpAwaitingApproval":
    case "signInAwaitingApproval":
      return "reset";
    case "timeout":
    case "rateLimit":
    default:
      return "retry";
  }
}

function ContactSupportPrompt() {
  const { text, supportURL } = useConfiguration();

  if (!supportURL) {
    return null;
  }

  return (
    <>
      <Divider>{text["error.divider"]}</Divider>
      <div
        className={clsx("sid-form-error-contact-support", styles.supportPrompt)}
        data-testid="sid-form-error-support-prompt"
      >
        <a
          className={styles.supportCta}
          target="_blank"
          href={supportURL}
          rel="noreferrer"
        >
          <Button variant="secondary">
            {text["error.contactSupport.cta"]}
          </Button>
        </a>
      </div>
    </>
  );
}

type Props = {
  flowState: ErrorState;
};

type ErrorProps = {
  context: ErrorState["context"];
  retry: Retry;
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
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  useEffect(() => {
    setErrorType(null);
    (async () => {
      const type = await getErrorType(flowState.context.error);
      setErrorType(type);
    })();
  }, [flowState.context.error]);

  if (!errorType) return <></>;

  const { title, description, retry } = mapErrorTypeToText(errorType);
  const retryPolicy = mapErrorTypeToRetryPolicy(errorType);
  const isNeutralError = NEUTRAL_ERRORS.includes(errorType);

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
      <ErrorIcon variant={isNeutralError ? "grey" : "red"} />
      <Button
        type="submit"
        variant="primary"
        testId="sid-form-error-retry-button"
        onClick={() => flowState.retry(retryPolicy)}
      >
        {text[retry]}
      </Button>
      <ContactSupportPrompt />
    </article>
  );
};
