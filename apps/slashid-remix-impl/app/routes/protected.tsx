import { redirect, type MetaFunction } from "@remix-run/node";
import { getUser, useSlashID } from "@slashid/remix";
import { slashIDLoader } from "../slashid";

export const meta: MetaFunction = () => {
  return [
    { title: "Protected" },
    { name: "description", content: "This is protected" },
  ];
};

export const loader = slashIDLoader(async (args) => {
  const user = getUser(args);

  if (!user) {
    return redirect("/login");
  }

  return {};
});

export default function Protected() {
  const { logOut } = useSlashID();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>This page is protected!</h1>
      <button onClick={logOut}>Log out</button>
    </div>
  );
}
