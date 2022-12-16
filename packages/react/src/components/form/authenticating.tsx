import { sprinkles } from "../../theme/sprinkles.css";
import { Button } from "../button";
import { AuthenticatingState } from "./flow";
import { Text } from "../text";
import { LinkButton } from "../button/link-button";
import * as styles from "./authenticating.css";
import { useConfiguration } from "../../hooks/use-configuration";

type Props = {
  flowState: AuthenticatingState;
};

export const Authenticating: React.FC<Props> = ({ flowState }) => {
  const { text } = useConfiguration();

  return (
    <div data-testid="sid-form-authenticating-state">
      <h1>authenticating</h1>
      <h2>Auth method:</h2>
      <div>
        <pre>{JSON.stringify(flowState.context.options, null, 2)}</pre>
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
