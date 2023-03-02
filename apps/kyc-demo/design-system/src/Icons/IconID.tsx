import { svgIconProps, IconProps } from "@buildo/bento-design-system";

export function IconID(props: IconProps) {
  return (
    <svg {...svgIconProps(props)}>
      <path d="M0 5.4C0 3.15016 0 2.02524 0.572949 1.23664C0.757988 0.98196 0.98196 0.757988 1.23664 0.572949C2.02524 0 3.15016 0 5.4 0L18.6 0C20.8498 0 21.9748 0 22.7634 0.572949C23.018 0.757988 23.242 0.98196 23.4271 1.23664C24 2.02524 24 3.15016 24 5.4L24 12.6C24 14.8498 24 15.9748 23.4271 16.7634C23.242 17.018 23.018 17.242 22.7634 17.4271C21.9748 18 20.8498 18 18.6 18L5.4 18C3.15016 18 2.02524 18 1.23664 17.4271C0.98196 17.242 0.757988 17.018 0.572949 16.7634C0 15.9748 0 14.8498 0 12.6L0 5.4Z" />
    </svg>
  );
}
