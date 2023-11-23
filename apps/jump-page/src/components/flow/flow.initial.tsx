import { Skeleton, Stack } from "@slashid/react-primitives";
import { Loader } from "./flow.loader";

export function Initial() {
  return (
    <>
      <Stack space="0.75">
        <Skeleton width={"75%"} height={24} />
        <Skeleton width={"50%"} height={18} />
      </Stack>
      <Loader />
    </>
  );
}
