import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Public" },
    { name: "description", content: "This is public" },
  ];
};

export default function Public() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>This page is public!</h1>
    </div>
  );
}
