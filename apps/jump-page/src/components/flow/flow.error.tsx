import { Circle, Exclamation, Stack } from "@slashid/react-primitives";
import { Text } from "../text";

export type ErrorType = "warning" | "error";

function ErrorIcon({ type }: { type: ErrorType }) {
  return (
    <Circle variant={type === "warning" ? "blue" : "red"} shouldAnimate={false}>
      <Exclamation />
    </Circle>
  );
}

export function Error({ type }: { type: ErrorType }) {
  return (
    <>
      <Stack space="0.25">
        <Text
          as="h1"
          variant={{ size: "2xl-title", weight: "bold" }}
          t="error.title"
        />
        <Text
          as="h2"
          t="error.detail"
          variant={{ color: "contrast", weight: "semibold" }}
        />
      </Stack>
      <ErrorIcon type={type} />
    </>
  );
}
