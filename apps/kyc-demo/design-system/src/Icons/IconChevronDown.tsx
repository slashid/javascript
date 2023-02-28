import { svgIconProps, IconProps } from "@buildo/bento-design-system";

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...svgIconProps(props)}>
      <path d="M0.54526 -0.514968C0.260851 -0.816106 -0.213829 -0.829669 -0.514968 -0.54526C-0.816106 -0.260851 -0.829669 0.213829 -0.54526 0.514968L0.54526 -0.514968ZM6.375 6.75L5.82974 7.26497C5.97142 7.41498 6.16865 7.5 6.375 7.5C6.58135 7.5 6.77858 7.41498 6.92026 7.26497L6.375 6.75ZM13.2953 0.514968C13.5797 0.213829 13.5661 -0.260851 13.265 -0.54526C12.9638 -0.829669 12.4891 -0.816106 12.2047 -0.514968L13.2953 0.514968ZM-0.54526 0.514968L5.82974 7.26497L6.92026 6.23503L0.54526 -0.514968L-0.54526 0.514968ZM6.92026 7.26497L13.2953 0.514968L12.2047 -0.514968L5.82974 6.23503L6.92026 7.26497Z" />
    </svg>
  );
}
