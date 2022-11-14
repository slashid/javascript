import { useSlashID } from "@slashid/react";
import { useEffect, useState } from "react";
import CodeBlock from "../CodeBlock";
import Logo from "../Icons/Logo";
import css from "./profile.module.css";

export const Profile = () => {
  const { user, logOut } = useSlashID();
  const userToken = user?.token;
  const [userAttributes, setUserAttributes] = useState({});

  useEffect(() => {
    if (user) {
      const fetchAttributes = async () => {
        const attributes = await user.get();
        setUserAttributes(attributes);
      };

      fetchAttributes();
    }
  }, [user]);

  return (
    <main className={css.host}>
      <div className={css.navbar}>
        <i className={css.logo}>
          <Logo />
        </i>
        <button className={css.logoutButton} onClick={() => logOut()}>
          Logout
        </button>
      </div>

      <div className={css.content}>
        <p className={css.title}>User profile</p>

        <div className={css.header}>
          <p className={css.attributesTitle}>
            <span className={css.slash}>/</span> User token
          </p>

          <p className={css.userToken}>{userToken}</p>
        </div>

        <div className={css.columnsWrapper}>
          <div className={css.column}>
            {/* @ts-expect-error TODO private access */}
            {user && <CodeBlock code={user.decoded} />}
          </div>

          <div className={css.column}>
            <div>
              <p className={css.attributesTitle}>
                <span className={css.slash}>/</span> Data Vault - Add user
                attribute
              </p>

              <div style={{ width: "100%", paddingTop: "12px" }} />

              {/* <Input
                isSmall
                label="Key"
                placeholder="Add a key"
                onChange={(e) => setNewKey(e.target.value)}
                value={newKey}
              />

              <div style={{ width: "100%", paddingTop: "12px" }} />

              <Input
                isSmall
                label="Value"
                placeholder="Add a value"
                onChange={(e) => setNewValue(e.target.value)}
                value={newValue}
              />

              <div style={{ width: "100%", paddingTop: "12px" }} />

              <Button
                isSmall
                label="Add new attribute"
                isDisabled={newKey === "" || newValue === ""}
                onClick={setNewUserAttributes}
              /> */}
            </div>

            {userAttributes && (
              <CodeBlock code={JSON.stringify(userAttributes)} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
