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
import { Children, useEffect, useRef, useState } from "react";
import { TOTPState } from "./totp";
import { Delayed } from "@slashid/react-primitives";
import { useInternalFormContext } from "../internal-context";
import { AuthenticatingState } from "../flow/flow.common";
import { TIME_MS } from "../types";
import { Loader } from "./icons";
import {
  AuthnContextUpdateChallengeReceivedEvent,
  Factor,
} from "@slashid/slashid";
import { useSlashID } from "../../../main";

const DELAY_BEFORE_RETRY = TIME_MS.second * 30;

const LoadingState = ({ flowState }: Props) => {
  const { factor, handle } = flowState.context.config;
  const { title, message, tokens } = getAuthenticatingMessage(factor, handle);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    if (!showPrompt) {
      setShowPrompt(true);
    }
  }, [showPrompt]);

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
        {factor.method === "saml" ? (
          <span className={styles.oidcTitle}>SSO</span>
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
  // null rather than 0: the org-switching flow's first attempt is numbered 0
  const loggedInAttempt = useRef<number | null>(null);
  const [establishedAuthContext, setEstablishedAuthContext] = useState(false);
  const { subscribe, unsubscribe } = useSlashID();

  // the subscription and the login have different lifecycles: every run must
  // subscribe and every cleanup unsubscribe, while the login fires once per
  // attempt and never again on a re-run
  useEffect(() => {
    const handleAuthnContextUpdate = (
      event: AuthnContextUpdateChallengeReceivedEvent
    ) => {
      flowState.updateContext({
        attempt: flowState.context.attempt,
        options: flowState.context.options,
        config: {
          factor: (event.factor as Factor) || flowState.context.config.factor,
          handle: flowState.context.config.handle,
        },
      });
      setEstablishedAuthContext(true);
    };

    subscribe(
      "authnContextUpdateChallengeReceivedEvent",
      handleAuthnContextUpdate
    );

    return () =>
      unsubscribe(
        "authnContextUpdateChallengeReceivedEvent",
        handleAuthnContextUpdate
      );
  }, [flowState, subscribe, unsubscribe]);

  useEffect(() => {
    if (loggedInAttempt.current === flowState.context.attempt) return;
    loggedInAttempt.current = flowState.context.attempt;
    flowState.logIn();
  }, [flowState]);

  if (!establishedAuthContext) {
    // block rendering until we hear back from the core SDK
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );
  }

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
