import {
  isFactorOTP,
  isFactorPassword,
  isFactorTOTP,
} from "../../../domain/handles";
import { Text } from "../../text";

import { getAuthenticatingMessage } from "./messages";
import { OTPState } from "./otp";
import { PasswordState } from "./password";
import { TOTPState } from "./totp";
import { Props } from "./authenticating.types";
import {
  BackButton,
  FactorIcon,
  RetryPrompt,
} from "./authenticating.components";

import * as styles from "./authenticating.css";

const LoadingState = ({ flowState }: Props) => {
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
      <FactorIcon factor={factor} />
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

  if (isFactorTOTP(factor)) {
    return (
      <Wrapper>
        <TOTPState flowState={flowState} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <LoadingState flowState={flowState} />
    </Wrapper>
  );
};
