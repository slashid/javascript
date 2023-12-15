import { CSSProperties } from "react";
import { container } from "./skeleton.css";

interface Props {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  minHeight?: CSSProperties["minHeight"];
  maxHeight?: CSSProperties["maxHeight"];
  minWidth?: CSSProperties["minWidth"];
  maxWidth?: CSSProperties["maxWidth"];
}

export function Skeleton({
  width,
  height,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
}: Props) {
  return (
    <div
      className={container}
      style={{
        width,
        height,
        minHeight,
        maxHeight,
        minWidth,
        maxWidth,
      }}
    />
  );
}
