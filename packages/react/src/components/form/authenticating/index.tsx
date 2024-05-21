import {
  isFactorOTP,
  isFactorPassword,
  isFactorTOTP,
} from "../../../domain/handles";
import { Text } from "../../text";

import { getAuthenticatingMessage, getTokensFromHandle } from "./messages";
import { OTPState } from "./otp";
import { PasswordState } from "./password";
import { Props } from "./authenticating.types";
import { BackButton, FactorIcon, Prompt } from "./authenticating.components";

import * as styles from "./authenticating.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { TOTPState } from "./totp";
import { Delayed } from "@slashid/react-primitives";
import { BASE_RETRY_DELAY_MS } from "./authenticating.constants";

const LoadingState = ({ flowState, performLogin }: Props) => {
  const { factor, handle } = flowState.context.config;
  const { title, message } = getAuthenticatingMessage(factor);
  const tokens = getTokensFromHandle(handle);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    if (!showPrompt) {
      setShowPrompt(true);
    }
  }, [showPrompt]);

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
      <Text
        t={message}
        variant={{ color: "contrast", weight: "semibold" }}
        tokens={tokens}
      />
      <FactorIcon factor={factor} />
      {showPrompt && (
        <Delayed
          delayMs={BASE_RETRY_DELAY_MS * flowState.context.attempt}
          fallback={<div style={{ height: 16 }} />}
        >
          <div className={styles.wrapper}>
            <Prompt
              prompt="authenticating.retryPrompt"
              cta="authenticating.retry"
              onClick={() => {
                flowState.retry();
                setShowPrompt(false);
              }}
            />
          </div>
        </Delayed>
      )}
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
  const attempt = useRef(1);
  const isLoggingIn = useRef(false);

  const performLogin = useCallback(() => {
    if (flowState.context.attempt > attempt.current) {
      attempt.current = flowState.context.attempt;
      isLoggingIn.current = false;
    }

    if (isLoggingIn.current) return;

    flowState.logIn();
    isLoggingIn.current = true;
  }, [flowState]);

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
