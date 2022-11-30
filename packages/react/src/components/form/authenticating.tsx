import { AuthenticatingState } from "./flow";

type Props = {
  flowState: AuthenticatingState;
};

export const Authenticating: React.FC<Props> = ({ flowState }) => {
  return (
    <div data-testid="sid-form-authenticating-state">
      <h1>authenticating</h1>
      <h2>Auth method:</h2>
      <div>
        <pre>{JSON.stringify(flowState.context.options, null, 2)}</pre>
      </div>
      <div>
        <button type="button" onClick={() => flowState.retry()}>
          Retry
        </button>
        <button
          data-testid="sid-form-authenticating-cancel-button"
          type="button"
          onClick={() => flowState.cancel()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
