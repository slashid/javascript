import { svgIconProps, IconProps } from "@buildo/bento-design-system";

export function IconCalendar(props: IconProps) {
  return (
    <svg {...svgIconProps(props)}>
      <path d="M0 -0.75C-0.414214 -0.75 -0.75 -0.414214 -0.75 0C-0.75 0.414214 -0.414214 0.75 0 0.75L0 -0.75ZM3.75 0.75C4.16421 0.75 4.5 0.414214 4.5 0C4.5 -0.414214 4.16421 -0.75 3.75 -0.75L3.75 0.75ZM0 0.75L3.75 0.75L3.75 -0.75L0 -0.75L0 0.75Z" />
      <path d="M0 0L21 0L21 2.25L0 2.25L0 0Z" />
    </svg>
  );
}
