import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { CreateTripPage } from "./pages/create-trip"
import { TripDetailsPage } from "./pages/trip-details"
import { LoginPage } from "./pages/user-session/login"

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateTripPage />
  },
  {
    path: "/trips/:tripId",
    element: <TripDetailsPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  }
  
])

export function App() {
  return <RouterProvider router={router} />
}
