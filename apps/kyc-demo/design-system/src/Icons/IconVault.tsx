import { svgIconProps, IconProps } from "@buildo/bento-design-system";

export function IconVault(props: IconProps) {
  return (
    <svg {...svgIconProps(props)}>
      <path d="M3 1.5C3 2.32843 2.32843 3 1.5 3C0.671573 3 0 2.32843 0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5Z" />
      <path d="M14.25 7.5C14.25 11.2279 11.2279 14.25 7.5 14.25L7.5 15.75C12.0563 15.75 15.75 12.0563 15.75 7.5L14.25 7.5ZM7.5 14.25C3.77208 14.25 0.75 11.2279 0.75 7.5L-0.75 7.5C-0.75 12.0563 2.94365 15.75 7.5 15.75L7.5 14.25ZM0.75 7.5C0.75 3.77208 3.77208 0.75 7.5 0.75L7.5 -0.75C2.94365 -0.75 -0.75 2.94365 -0.75 7.5L0.75 7.5ZM7.5 0.75C11.2279 0.75 14.25 3.77208 14.25 7.5L15.75 7.5C15.75 2.94365 12.0563 -0.75 7.5 -0.75L7.5 0.75Z" />
    </svg>
  );
}
