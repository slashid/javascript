import React from "react";
import ReactDOM from "react-dom/client";
import { Form } from "./components/form";
import { SlashIDProvider } from "./main";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider oid="f978a6bd-3e45-bcda-cb4e-573d0bad155b">
      <Form />
    </SlashIDProvider>
  </React.StrictMode>
);
