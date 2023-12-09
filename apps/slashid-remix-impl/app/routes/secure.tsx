import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Secure" },
    { name: "description", content: "This is secure" },
  ];
};

export const loader: LoaderFunction = async (args) => {
  // TODO
  // API to check if the user is authenticated

  return {}
}

export default function Secure() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>This page is secure!</h1>
    </div>
  );
}
