import React from "react";
import ReactDOM from "react-dom/client";
import { Form } from "./components/form";
import { ConfigurationProvider } from "./context/config-context";
import { SlashIDProvider } from "./main";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider oid={import.meta.env.VITE_ORG_ID}>
      <ConfigurationProvider text={{ "initial.title": "Title override" }}>
        <div style={{ width: "390px" }}>
          <Form />
        </div>
      </ConfigurationProvider>
    </SlashIDProvider>
  </React.StrictMode>
);
