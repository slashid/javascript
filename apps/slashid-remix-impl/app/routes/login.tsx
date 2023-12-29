import { redirect, type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import {
  ConfigurationProvider,
  Form,
  type Factor,
  getUser,
} from "@slashid/remix";
import { slashIDLoader } from "~/slashid";

export const meta: MetaFunction = () => {
  return [{ title: "Login" }, { name: "description", content: "Login" }];
};

export const loader = slashIDLoader(async (args) => {
  const user = getUser(args);

  if (user) {
    return redirect("/");
  }

  return {};
});

const factors: Factor[] = [{ method: "email_link" }];

export default function Index() {
  return (
    <div style={{ width: "500px" }}>
      <ConfigurationProvider factors={factors}>
        <Form />
      </ConfigurationProvider>
    </div>
  );
}
