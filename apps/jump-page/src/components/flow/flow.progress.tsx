import { Stack } from "@slashid/react-primitives";
import { Loader } from "./flow.loader";
import { Text } from "../text";
import { useEffect } from "react";

export type Props = {
  onSuccess: () => void;
};

export function Progress({ onSuccess }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSuccess();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <>
      <Stack space="0.25">
        <Text
          as="h1"
          variant={{ size: "2xl-title", weight: "bold" }}
          t="initial.title"
        />
        <Text
          variant={{ color: "contrast", weight: "semibold" }}
          as="h2"
          t="initial.details"
        />
      </Stack>
      <Loader />
    </>
  );
}
