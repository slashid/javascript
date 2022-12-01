import React from "react";
import ReactDOM from "react-dom/client";
import { Form } from "./components/form";
import { SlashIDProvider } from "./main";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider oid={import.meta.env.VITE_ORG_ID}>
      <Form />
    </SlashIDProvider>
  </React.StrictMode>
);
