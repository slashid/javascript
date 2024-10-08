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
  AuthenticatingSubtitle,
  BackButton,
  DelayedPrompt,
  FactorIcon,
  Prompt,
} from "./authenticating.components";

import * as styles from "./authenticating.css";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { TOTPState } from "./totp";
import { Delayed } from "@slashid/react-primitives";
import { useInternalFormContext } from "../internal-context";
import { AuthenticatingState } from "../flow";
import { TIME_MS } from "../types";

const DELAY_BEFORE_RETRY = TIME_MS.second * 30;

const LoadingState = ({ flowState, performLogin }: Props) => {
  const { factor, handle } = flowState.context.config;
  const { title, message, tokens } = getAuthenticatingMessage(factor, handle);
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
      <Text
        className="sid-form-authenticating-title sid-form-authenticating-title-loading"
        as="h1"
        t={title}
        variant={{ size: "2xl-title", weight: "bold" }}
      >
        {factor.method === "oidc" ? (
          <span className={styles.oidcTitle}>
            {factor.options?.provider as unknown as string}
          </span>
        ) : undefined}
      </Text>
      <AuthenticatingSubtitle />
      <Text
        t={message}
        variant={{ color: "contrast", weight: "semibold" }}
        tokens={tokens}
      />
      <FactorIcon factor={factor} />
      {showPrompt && (
        <Delayed
          delayMs={DELAY_BEFORE_RETRY}
          fallback={({ secondsRemaining }) => (
            <div className={styles.wrapper}>
              <DelayedPrompt
                prompt="authenticating.retryPrompt"
                cta="authenticating.retry"
                secondsRemaining={secondsRemaining}
              />
            </div>
          )}
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

export type AuthenticatingAsAFunctionProps = Omit<
  AuthenticatingState,
  "status"
>;

type AuthenticatingTemplateProps = {
  children?:
    | React.ReactNode
    | ((renderProps: AuthenticatingAsAFunctionProps) => React.ReactNode);
};

export function Authenticating({ children }: AuthenticatingTemplateProps) {
  const { flowState } = useInternalFormContext();

  if (flowState?.status !== "authenticating") return null;

  if (typeof children === "function") {
    return (
      <div data-testid="sid-form-authenticating-function">
        {children(flowState)}
      </div>
    );
  }

  if (Children.count(children) > 0)
    return <div data-testid="sid-form-authenticating-children">{children}</div>;

  return <AuthenticatingImplementation flowState={flowState} />;
}

export type AuthenticatingProps = Pick<Props, "flowState">;

export const AuthenticatingImplementation = ({
  flowState,
}: AuthenticatingProps) => {
  const factor = flowState.context.config.factor;
  const attempt = useRef(1);
  const isLoggingIn = useRef(false);

  const performLogin = useCallback(() => {
    if (flowState.context.attempt > attempt.current) {
      attempt.current = flowState.context.attempt;
      isLoggingIn.current = false;
    }

    if (isLoggingIn.current) return;

    /**
     * We used to call logIn immediately upon transitioning to Authenticating state.
     * That caused a race condition because the HTTP response could have potentially
     * been received before the components attached the required event listeners.
     *
     * This allows the UI components to do their setup and then notify the flowState it is ok to log in.
     */
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
