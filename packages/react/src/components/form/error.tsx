import { ErrorState } from "./flow";

type Props = {
  flowState: ErrorState;
};

export const Error: React.FC<Props> = () => {
  return (
    <div data-testid="sid-form-error-state">
      <h1>error</h1>
    </div>
  );
};
