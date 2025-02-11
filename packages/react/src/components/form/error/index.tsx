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
import { ErrorState } from "../flow/flow.common";
import { useInternalFormContext } from "../internal-context";

import * as styles from "./error.css";
import { Retry, RetryPolicy } from "../../../domain/types";

type TextTokens =
  | {
      EMAIL_ADDRESS: string;
    }
  | {
      PHONE_NUMBER: string;
    };
function getTextTokensFromFlowState(
  flowState: ErrorState
): TextTokens | undefined {
  if (flowState.context.config.handle?.type === "email_address") {
    return { EMAIL_ADDRESS: flowState.context.config.handle.value };
  }

  if (flowState.context.config.handle?.type === "phone_number") {
    return { PHONE_NUMBER: flowState.context.config.handle.value };
  }

  return undefined;
}

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
  | "invalidEmailAddressFormat"
  | "invalidPhoneNumberFormat"
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
  if (Errors.isTimeoutError(error)) {
    return "timeout";
  }

  if (Errors.isInvalidEmailAddressFormatError(error))
    return "invalidEmailAddressFormat";

  if (Errors.isInvalidPhoneNumberFormatError(error))
    return "invalidPhoneNumberFormat";

  if (Errors.isAPIResponseError(error)) return "response";

  if (Errors.isRateLimitError(error)) {
    return "rateLimit";
  }

  if (Errors.isNonReachableHandleTypeError(error)) {
    return "recoverNonReachableHandleType";
  }

  if (Errors.isNoPasswordSetError(error)) {
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

/**
 * Text overrides config for the view that allows users to authenticate in another way, by following a link.
 */
type AlternativeAuth = {
  promptKey: TextConfigKey;
  ctaKey: TextConfigKey;
};

function mapErrorTypeToAlternativeAuth(
  errorType: ErrorType
): AlternativeAuth | undefined {
  switch (errorType) {
    case "selfRegistrationNotAllowed":
      return {
        promptKey: "error.selfRegistrationNotAllowed.alternativeAuth.prompt",
        ctaKey: "error.selfRegistrationNotAllowed.alternativeAuth.cta",
      };
    default:
      return undefined;
  }
}

type TextOverrides = {
  title: TextConfigKey;
  description: TextConfigKey;
  retry: TextConfigKey;
};

function mapErrorTypeToText(errorType: ErrorType): TextOverrides {
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
    case "invalidEmailAddressFormat":
      return {
        title: "error.title.invalidEmailAddressFormat",
        description: "error.subtitle.invalidEmailAddressFormat",
        retry: "error.retry.invalidEmailAddressFormat",
      };
    case "invalidPhoneNumberFormat":
      return {
        title: "error.title.invalidPhoneNumberFormat",
        description: "error.subtitle.invalidPhoneNumberFormat",
        retry: "error.retry.invalidPhoneNumberFormat",
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
    case "invalidEmailAddressFormat":
    case "invalidPhoneNumberFormat":
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

/**
 * Renders a prompt to authenticate in another way, by following a link.
 */
function UseAlternativeAuthPrompt({
  textKeys,
}: {
  textKeys?: AlternativeAuth;
}) {
  const { text, alternativeAuthURL } = useConfiguration();

  if (!alternativeAuthURL || !textKeys) {
    return null;
  }

  return (
    <div
      className={clsx(
        "sid-form-error-alternative-auth-prompt",
        styles.alternativeAuthPrompt
      )}
      data-testid="sid-form-error-alternative-auth-prompt"
    >
      <span>{text[textKeys.promptKey]}</span>
      <a
        className={styles.alternativeAuthCta}
        target="_blank"
        href={alternativeAuthURL}
        rel="noreferrer"
      >
        {text[textKeys.ctaKey]}
      </a>
    </div>
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
  const alternativeAuth = mapErrorTypeToAlternativeAuth(errorType);
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
        tokens={getTextTokensFromFlowState(flowState)}
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
      <UseAlternativeAuthPrompt textKeys={alternativeAuth} />
    </article>
  );
};
