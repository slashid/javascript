import { clsx } from "clsx";
import { publicVariables } from "../../theme/theme.css";

type Props = {
  className?: string;
};

export const ChevronLeft: React.FC<Props> = ({ className }) => (
  <svg
    className={clsx(className)}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.25 3.75L5.75 8L10.25 12.25"
      stroke={publicVariables.color.tertiary}
      strokeOpacity="0.5"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
