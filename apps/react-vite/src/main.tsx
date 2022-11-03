import { SlashIDProvider } from "@slashid/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider
      oid={import.meta.env.VITE_ORG_ID}
      tokenStorage="localStorage"
    >
      <App />
    </SlashIDProvider>
  </React.StrictMode>
);
