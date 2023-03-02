import { svgIconProps, IconProps } from "@buildo/bento-design-system";

export function IconHeart(props: IconProps) {
  return (
    <svg {...svgIconProps(props)}>
      <path d="M0 6.74928C0 3.02176 3.02208 0 6.75 0C8.8716 0 10.7631 0.978462 12 2.5071C13.2369 0.978462 15.1284 0 17.25 0C20.9779 0 24 3.02176 24 6.74928C24 13.7402 18.3365 19.3405 12.5205 22.3701L12.518 22.3715C12.195 22.5428 11.805 22.5428 11.4829 22.3719C5.6409 19.3466 0 13.7593 0 6.74928Z" />
    </svg>
  );
}
