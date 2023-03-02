import { svgIconProps, IconProps } from "@buildo/bento-design-system";

export function IconRemove(props: IconProps) {
  return (
    <svg {...svgIconProps(props)}>
      <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" />
      <path d="M22.5 12C22.5 17.799 17.799 22.5 12 22.5L12 25.5C19.4558 25.5 25.5 19.4558 25.5 12L22.5 12ZM12 22.5C6.20101 22.5 1.5 17.799 1.5 12L-1.5 12C-1.5 19.4558 4.54416 25.5 12 25.5L12 22.5ZM1.5 12C1.5 6.20101 6.20101 1.5 12 1.5L12 -1.5C4.54416 -1.5 -1.5 4.54416 -1.5 12L1.5 12ZM12 1.5C17.799 1.5 22.5 6.20101 22.5 12L25.5 12C25.5 4.54416 19.4558 -1.5 12 -1.5L12 1.5Z" />
      <path d="M0 -0.75C-0.414214 -0.75 -0.75 -0.414214 -0.75 0C-0.75 0.414214 -0.414214 0.75 0 0.75L0 -0.75ZM9 0.75C9.41421 0.75 9.75 0.414214 9.75 0C9.75 -0.414214 9.41421 -0.75 9 -0.75L9 0.75ZM0 0.75L9 0.75L9 -0.75L0 -0.75L0 0.75Z" />
    </svg>
  );
}
