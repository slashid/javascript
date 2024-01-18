import { Factor } from "@slashid/slashid";
import { LinkButton } from "@slashid/react-primitives";

import { sprinkles } from "@slashid/react-primitives";

import {
  isFactorEmailLink,
  isFactorOTP,
  isFactorPassword,
  isFactorSmsLink,
} from "../../../domain/handles";
import { useConfiguration } from "../../../hooks/use-configuration";
import { Text } from "../../text";
import { AuthenticatingState } from "./../flow";

import * as styles from "./authenticating.css";
import { EmailIcon, SmsIcon, Loader } from "./icons";
import { getAuthenticatingMessage } from "./messages";
import { OTPState } from "./otp";
import { PasswordState } from "./password";

const NonOTPIcon = ({ factor }: { factor: Factor }) => {
  if (isFactorEmailLink(factor)) {
    return <EmailIcon />;
  }

  if (isFactorSmsLink(factor)) {
    return <SmsIcon />;
  }

  return <Loader />;
};

const BackButton = ({ onCancel }: { onCancel: () => void }) => {
  const { text } = useConfiguration();
  return (
    <LinkButton
      className={sprinkles({ marginBottom: "4" })}
      testId="sid-form-authenticating-cancel-button"
      variant="back"
      onClick={onCancel}
    >
      {text["authenticating.back"]}
    </LinkButton>
  );
};

const RetryPrompt = ({ onRetry }: { onRetry: () => void }) => {
  const { text } = useConfiguration();
  return (
    <div className={styles.retryPrompt}>
      <Text
        variant={{ size: "sm", color: "tertiary", weight: "semibold" }}
        t="authenticating.retryPrompt"
      />
      <LinkButton
        className={sprinkles({ marginLeft: "1" })}
        type="button"
        testId="sid-form-authenticating-retry-button"
        onClick={onRetry}
      >
        {text["authenticating.retry"]}
      </LinkButton>
    </div>
  );
};

type Props = {
  flowState: AuthenticatingState;
};

const NonOTPContent = ({ flowState }: Props) => {
  const factor = flowState.context.config.factor;
  const { title, message } = getAuthenticatingMessage(factor);

  return (
    <>
      <BackButton onCancel={() => flowState.cancel()} />
      <Text as="h1" t={title} variant={{ size: "2xl-title", weight: "bold" }}>
        {factor.method === "oidc" ? (
          <span className={styles.oidcTitle}>
            {factor.options?.provider as unknown as string}
          </span>
        ) : undefined}
      </Text>
      <Text t={message} variant={{ color: "contrast", weight: "semibold" }} />
      <NonOTPIcon factor={factor} />
      <RetryPrompt onRetry={() => flowState.retry()} />
    </>
  );
};

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <article data-testid="sid-form-authenticating-state">{children}</article>
  );
}

export const Authenticating = ({ flowState }: Props) => {
  const factor = flowState.context.config.factor;

  if (isFactorOTP(factor)) {
    return (
      <Wrapper>
        <OTPState flowState={flowState} />
      </Wrapper>
    );
  }

  if (isFactorPassword(factor)) {
    return (
      <Wrapper>
        <PasswordState flowState={flowState} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <NonOTPContent flowState={flowState} />
    </Wrapper>
  );
};
