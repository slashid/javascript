import { Outlet, ReactLocation, Router } from "@tanstack/react-location";
import { DesignSystemProvider } from "design-system";
import { defaultMessages } from "./defaultMessages";
import { FullFlow } from "./FullFlow";
import { MobileUploadFlow } from "./MobileUploadFlow";

const location = new ReactLocation();

export function App() {
  return (
    <DesignSystemProvider defaultMessages={defaultMessages}>
      <Router
        location={location}
        routes={[
          {
            path: "/mobile-upload",
            element: <MobileUploadFlow />,
          },
          {
            path: "/",
            element: <FullFlow />,
          },
        ]}
      >
        <Outlet />
      </Router>
    </DesignSystemProvider>
  );
}
