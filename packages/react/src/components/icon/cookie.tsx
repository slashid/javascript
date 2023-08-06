import { clsx } from "clsx";
import { DARK_MODE } from ".";
import { publicVariables } from "../../theme/theme.css";

type Props = {
  className?: string;
  fill?: string;
};

export const Cookie = ({
  className,
  fill = publicVariables.color.background,
}: Props) => (
  <svg
    className={clsx(className)}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{DARK_MODE}</style>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.9998 6.96103L13.9998 6.95691C13.9974 6.79449 13.959 6.6346 13.8874 6.48877C13.8158 6.34294 13.7127 6.21479 13.5856 6.11357C13.4585 6.01235 13.3106 5.94058 13.1523 5.90346C12.9941 5.86634 12.8297 5.86479 12.6708 5.89894L12.6659 5.90001C12.4344 5.95196 12.1943 5.95157 11.9629 5.89886C11.7316 5.84615 11.515 5.74245 11.3288 5.59531C11.1425 5.44816 10.9915 5.26127 10.8866 5.04824C10.7821 4.83603 10.726 4.60323 10.7225 4.36668C10.7213 4.07884 10.6065 3.80298 10.4029 3.59926C10.1992 3.39552 9.92339 3.28054 9.63542 3.27933C9.39916 3.27578 9.16663 3.21974 8.95463 3.11523C8.74181 3.0103 8.55504 2.85917 8.40795 2.67282C8.26087 2.48647 8.15718 2.2696 8.10447 2.03803C8.05176 1.80645 8.05137 1.56602 8.10331 1.33427L8.10439 1.32937C8.13848 1.17054 8.13694 1.00612 8.09987 0.847953C8.0628 0.689787 7.99112 0.541797 7.88998 0.41465C7.78884 0.287501 7.66075 0.184359 7.51493 0.112677C7.3691 0.0409949 7.20918 0.00256304 7.04669 0.000166098L7.04169 0.000114905C5.64531 -0.00788549 4.27846 0.40206 3.11675 1.17724C1.95505 1.95242 1.05159 3.05742 0.522378 4.35021C-0.00682774 5.643 -0.137616 7.06456 0.146804 8.43228C0.431224 9.79999 1.11787 11.0514 2.11858 12.0258C4.84733 14.6831 9.25037 14.6542 11.9431 11.9606C12.601 11.3061 13.1217 10.5268 13.4749 9.66852C13.8281 8.80994 14.0066 7.88947 13.9998 6.96103ZM8.77386 10.7684C9.21895 10.7684 9.57977 10.4074 9.57977 9.96208C9.57977 9.51674 9.21895 9.15571 8.77386 9.15571C8.32878 9.15571 7.96796 9.51674 7.96796 9.96208C7.96796 10.4074 8.32878 10.7684 8.77386 10.7684ZM5.28166 9.4245C5.28166 9.86984 4.92084 10.2309 4.47576 10.2309C4.03067 10.2309 3.66986 9.86984 3.66986 9.4245C3.66986 8.97915 4.03067 8.61813 4.47576 8.61813C4.92084 8.61813 5.28166 8.97915 5.28166 9.4245ZM3.93849 6.46785C4.38358 6.46785 4.7444 6.10682 4.7444 5.66148C4.7444 5.21614 4.38358 4.85512 3.93849 4.85512C3.49341 4.85512 3.13259 5.21614 3.13259 5.66148C3.13259 6.10682 3.49341 6.46785 3.93849 6.46785ZM8.2365 6.73664C8.2365 7.18199 7.87569 7.54301 7.4306 7.54301C6.98551 7.54301 6.6247 7.18199 6.6247 6.73664C6.6247 6.2913 6.98551 5.93028 7.4306 5.93028C7.87569 5.93028 8.2365 6.2913 8.2365 6.73664Z"
      fill={fill}
    />
  </svg>
);
