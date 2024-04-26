import { clsx } from "clsx";
import { DARK_MODE } from "./dark-mode";

type Props = {
  className?: string;
};

export const Check: React.FC<Props> = ({ className }) => (
  <svg
    className={clsx(className)}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{DARK_MODE}</style>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM12.0676 5.49021C12.3384 5.17673 12.3037 4.70312 11.9902 4.43238C11.6767 4.16164 11.2031 4.1963 10.9324 4.50979L6.78035 9.3174L5.59201 7.78954C5.33771 7.46258 4.86651 7.40368 4.53954 7.65799C4.21258 7.91229 4.15368 8.3835 4.40799 8.71045L6.15799 10.9605C6.29594 11.1378 6.50614 11.244 6.73076 11.2498C6.95538 11.2555 7.17075 11.1603 7.31762 10.9902L12.0676 5.49021Z"
      fill="currentColor"
    />
  </svg>
);
