import { publicVariables } from "../../theme/theme.css";

export const ChevronDown = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.75 5.75L8 10.25L12.25 5.75"
      stroke={publicVariables.color.foreground}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
