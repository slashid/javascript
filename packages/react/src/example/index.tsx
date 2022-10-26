import React from "react";
import ReactDOM from "react-dom/client";
import App from "../components/App";
import { SlashIDProvider } from "../context/SlashIDContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SlashIDProvider oid="f978a6bd-3e45-bcda-cb4e-573d0bad155b">
      <App />
    </SlashIDProvider>
  </React.StrictMode>
);
