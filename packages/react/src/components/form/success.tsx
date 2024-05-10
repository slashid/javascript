import { Circle } from "@slashid/react-primitives";
import { Text } from "../text";
import { SuccessState } from "./flow";

const CheckIcon = () => (
  <Circle variant="primary">
    <svg
      width="21"
      height="18"
      viewBox="0 0 21 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.8505 0.705985C20.6342 1.38283 20.7209 2.56684 20.044 3.35055L8.16908 17.1005C7.80192 17.5256 7.2635 17.7637 6.70195 17.7493C6.1404 17.7349 5.61489 17.4695 5.27002 17.0261L0.895049 11.4011C0.259296 10.5837 0.406547 9.4057 1.22394 8.76995C2.04134 8.13419 3.21935 8.28145 3.8551 9.09884L6.82592 12.9185L17.2059 0.89949C17.8828 0.115778 19.0668 0.0291434 19.8505 0.705985Z"
        fill="white"
      />
    </svg>
  </Circle>
);

type Props = {
  flowState: SuccessState;
};

export const Success: React.FC<Props> = () => {
  return (
    <article data-testid="sid-form-success-state">
      <Text
        as="h1"
        t="success.title"
        variant={{ size: "2xl-title", weight: "bold" }}
      />
      <Text
        as="h2"
        t="success.subtitle"
        variant={{ color: "contrast", weight: "semibold" }}
      />
      <CheckIcon />
    </article>
  );
};
