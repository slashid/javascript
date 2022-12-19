import { centered, sprinkles } from "../../theme/sprinkles.css";
import { Button } from "../button";
import { AuthenticatingState } from "./flow";
import { Text } from "../text";
import { LinkButton } from "../button/link-button";
import * as styles from "./authenticating.css";
import { useConfiguration } from "../../hooks/use-configuration";
import { getAuthenticatingMessage } from "../../domain/handles";
import { Circle } from "../spinner/circle";
import { Spinner } from "../spinner/spinner";
import { clsx } from "clsx";

type Props = {
  flowState: AuthenticatingState;
};

export const Authenticating: React.FC<Props> = ({ flowState }) => {
  const { text } = useConfiguration();
  const { title, message } = getAuthenticatingMessage(
    flowState.context.options.factor
  );
  const factor = flowState.context.options.factor;

  return (
    <div data-testid="sid-form-authenticating-state">
      <LinkButton
        className={sprinkles({ marginBottom: "6" })}
        variant="back"
        onClick={() => flowState.cancel()}
      >
        {text["authenticating.back"]}
      </LinkButton>
      <Text as="h1" t={title} variant={{ size: "2xl-title" }}>
        {factor.method === "oidc" ? (
          <span className={styles.oidcTitle}>
            {factor.options?.provider as unknown as string}
          </span>
        ) : undefined}
      </Text>
      <Text t={message} variant={{ color: "contrast" }} />
      <div className={clsx(sprinkles({ marginY: "12" }), centered)}>
        <Circle>
          <Spinner />
        </Circle>
      </div>
      <div>
        <div className={styles.retryPrompt}>
          <Text
            variant={{ size: "sm", color: "tertiary" }}
            t="authenticating.retryPrompt"
          />
          <LinkButton type="button" onClick={() => flowState.retry()}>
            {text["authenticating.retry"]}
          </LinkButton>
        </div>
        <Button
          className={sprinkles({ marginY: "3" })}
          data-testid="sid-form-authenticating-cancel-button"
          type="button"
          variant="secondary"
          onClick={() => flowState.cancel()}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
