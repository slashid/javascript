import { svgIconProps, IconProps } from "@buildo/bento-design-system";

export function IconCloud(props: IconProps) {
  return (
    <svg {...svgIconProps(props)}>
      <path d="M15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5Z" />
      <path d="M10.5 5.25C10.5 8.1495 8.1495 10.5 5.25 10.5C2.35051 10.5 0 8.1495 0 5.25C0 2.35051 2.35051 0 5.25 0C8.1495 0 10.5 2.35051 10.5 5.25Z" />
      <path d="M13.5 6.75C13.5 10.4779 10.4779 13.5 6.75 13.5C3.02208 13.5 0 10.4779 0 6.75C0 3.02208 3.02208 0 6.75 0C10.4779 0 13.5 3.02208 13.5 6.75Z" />
      <path d="M0 0L12 0L12 6L0 6L0 0Z" />
    </svg>
  );
}
