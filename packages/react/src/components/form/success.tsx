import { SuccessState } from "./flow";

type Props = {
  flowState: SuccessState;
};

export const Success: React.FC<Props> = () => {
  return (
    <div data-testid="sid-form-success-state">
      <h1>success</h1>
    </div>
  );
};
