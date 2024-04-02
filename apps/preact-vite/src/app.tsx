import "./app.css";
import { SlashIDProvider } from "@slashid/react";

export function App() {
  return (
    <SlashIDProvider oid="1ad1f783-377d-af56-6bff-1e9d0ccdbffb">
      <div>hello</div>
    </SlashIDProvider>
  );
}
