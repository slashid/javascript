import { svgIconProps, IconProps } from "@buildo/bento-design-system";

export function IconSlash(props: IconProps) {
  return (
    <svg {...svgIconProps(props)}>
      <path d="M12 0L18 0L6 24L0 24L12 0Z" />
    </svg>
  );
}
