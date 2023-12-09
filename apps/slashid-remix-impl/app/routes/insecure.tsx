import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Insecure" },
    { name: "description", content: "This is insecure" },
  ];
};

export default function Insecure() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>This page is insecure!</h1>
    </div>
  );
}
