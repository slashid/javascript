import { svgIconProps, IconProps } from "@buildo/bento-design-system";

export function IconSlashCircle(props: IconProps) {
  return (
    <svg {...svgIconProps(props)}>
      <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" />
      <path d="M4.8 0L7.2 0L2.4 9.6L0 9.6L4.8 0Z" />
    </svg>
  );
}
