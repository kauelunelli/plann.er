import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { CreateTripPage } from "./pages/create-trip";
import { TripDetailsPage } from "./pages/trip-details";
import { Sidebar } from "./pages/user-session/sidebar";
import { ReactNode, useEffect, useState } from "react";
import { api } from "./lib/axios";

async function isAuthenticated() {
  try {
    await api.get("/authenticate", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("TOKEN_KEY")}`,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}

function RequireAuth({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setAuth(authenticated);
    };

    checkAuth();
  }, []);

  if (auth === null) {
    return null; // or a loading spinner or placeholder component
  }

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
