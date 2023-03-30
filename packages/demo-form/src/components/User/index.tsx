import { useSlashID } from "@slashid/react";

export const User = () => {
  const { user } = useSlashID();
  return (
    <pre data-testid="sid-user-object">{JSON.stringify(user, null, 2)}</pre>
  );
};
