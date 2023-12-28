import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { getUserFromRequest } from "@slashid/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "Protected" },
    { name: "description", content: "This is protected" },
  ];
};

export const loader: LoaderFunction = async (args) => {
  // TODO
  // API to check if the user is authenticated
  const user = getUserFromRequest(args.request);

  console.log(user, { user });

  if (!user) {
    return redirect("/");
  }

  return {};
};

export default function Protected() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>This page is protected!</h1>
    </div>
  );
}
