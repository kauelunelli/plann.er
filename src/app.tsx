import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { CreateTripPage } from "./pages/create-trip";
import { TripDetailsPage } from "./pages/trip-details";
import { Sidebar } from "./pages/user-session/sidebar";
import { ReactNode } from "react";

function isAuthenticated() {
  const token = localStorage.getItem("TOKEN_KEY");
  if (!token) {
    return false;
  }
  return true;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const auth = isAuthenticated(); //
  return auth ? children : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateTripPage />,
  },
  {
    path: "/trips/:tripId",
    element: <TripDetailsPage />,
  },
  {
    path: "/trips",
    element: (
      <RequireAuth>
        <Sidebar />
      </RequireAuth>
    ),
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
