import {
  isFactorOTP,
  isFactorPassword,
  isFactorTOTP,
} from "../../../domain/handles";
import { Text } from "../../text";

import { getAuthenticatingMessage } from "./messages";
import { OTPState } from "./otp";
import { PasswordState } from "./password";
import { Props } from "./authenticating.types";
import {
  BackButton,
  FactorIcon,
  RetryPrompt,
} from "./authenticating.components";

import * as styles from "./authenticating.css";
import { useEffect, useRef } from "react";
import { TOTPState } from "./totp";

const LoadingState = ({ flowState, performLogin }: Props) => {
  const factor = flowState.context.config.factor;
  const { title, message } = getAuthenticatingMessage(factor);

  useEffect(() => {
    performLogin();
  }, [performLogin]);

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

export const Authenticating = ({ flowState }: Pick<Props, "flowState">) => {
  const factor = flowState.context.config.factor;
  const isLoggingIn = useRef(false);

  const performLogin = () => {
    if (isLoggingIn.current) return;

    flowState.logIn();
    isLoggingIn.current = true;
  };

  if (isFactorOTP(factor)) {
    return (
      <Wrapper>
        <OTPState flowState={flowState} performLogin={performLogin} />
      </Wrapper>
    );
  }

  if (isFactorPassword(factor)) {
    return (
      <Wrapper>
        <PasswordState flowState={flowState} performLogin={performLogin} />
      </Wrapper>
    );
  }

  if (isFactorTOTP(factor)) {
    return (
      <Wrapper>
        <TOTPState flowState={flowState} performLogin={performLogin} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <LoadingState flowState={flowState} performLogin={performLogin} />
    </Wrapper>
  );
};
