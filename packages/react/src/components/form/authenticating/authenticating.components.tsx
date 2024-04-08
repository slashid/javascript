import { Factor } from "@slashid/slashid";
import { LinkButton, sprinkles } from "@slashid/react-primitives";

import { useConfiguration } from "../../../hooks/use-configuration";
import { Text } from "../../text";
import { isFactorEmailLink, isFactorSmsLink } from "../../../domain/handles";
import { EmailIcon, SmsIcon, Loader } from "./icons";

import * as styles from "./authenticating.css";
import { TextConfigKey } from "../../text/constants";

export const BackButton = ({ onCancel }: { onCancel: () => void }) => {
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

// TODO swap with a generic one
export const RetryPrompt = ({ onRetry }: { onRetry: () => void }) => {
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

type PromptProps = {
  onClick: () => void;
  prompt: TextConfigKey;
  cta: TextConfigKey;
};

export const Prompt = ({ onClick, prompt, cta }: PromptProps) => {
  const { text } = useConfiguration();
  return (
    <div className={styles.prompt}>
      <Text
        variant={{ size: "sm", color: "tertiary", weight: "semibold" }}
        t={prompt}
      />
      <LinkButton
        className={sprinkles({ marginLeft: "1" })}
        type="button"
        testId="sid-form-prompt-cta"
        onClick={onClick}
      >
        {text[cta]}
      </LinkButton>
    </div>
  );
};

export const FactorIcon = ({ factor }: { factor: Factor }) => {
  if (isFactorEmailLink(factor)) {
    return <EmailIcon />;
  }

  if (isFactorSmsLink(factor)) {
    return <SmsIcon />;
  }

  return <Loader />;
};
