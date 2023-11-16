import React from "react";
import { TextContext } from "./text-context";

export function useText() {
  const { text } = React.useContext(TextContext);

  return text;
}
