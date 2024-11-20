import { useSlashID } from "@slashid/react";
import styles from "./User.module.css";

function decodeToken(token: string): string {
  return JSON.stringify(
    JSON.parse(atob(token.split(".")[1]).toString()),
    undefined,
    2
  );
}

export const User = () => {
  const { user } = useSlashID();

  if (!user) {
    return null;
  }

  return (
    <>
      <h3>User token</h3>
      <pre className={styles.userToken} data-testid="sid-user-token">
        {user.token}
      </pre>
      <h3>Decoded token payload</h3>
      <pre className={styles.userToken} data-testid="sid-user-object">
        {decodeToken(user.token)}
      </pre>
    </>
  );
};
