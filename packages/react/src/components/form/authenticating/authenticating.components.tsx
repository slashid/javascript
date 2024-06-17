import { Factor } from "@slashid/slashid";
import { LinkButton, TextContext, sprinkles } from "@slashid/react-primitives";

import { useConfiguration } from "../../../hooks/use-configuration";
import { Text } from "../../text";
import { isFactorEmailLink, isFactorSmsLink } from "../../../domain/handles";
import { EmailIcon, SmsIcon, Loader } from "./icons";

import * as styles from "./authenticating.css";
import { TextConfigKey } from "../../text/constants";
import { useContext } from "react";

/**
 * This must be present in all authenticating states.
 * It only renders if the text key `authenticating.subtitle` is present.
 */
export const AuthenticatingSubtitle = () => {
  const { text } = useContext(TextContext);

  if (!text["authenticating.subtitle"]) {
    return null;
  }

  return (
    <Text
      as="p"
      className="sid-text-authenticating-subtitle"
      t="authenticating.subtitle"
    />
  );
};

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
