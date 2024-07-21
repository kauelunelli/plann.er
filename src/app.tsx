import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { CreateTripPage } from "./pages/create-trip"
import { TripDetailsPage } from "./pages/trip-details"
import { Sidebar } from "./pages/user-session/sidebar"


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
    path: "/trips",
    element: <Sidebar />
  },

  
])

export function App() {
  return <RouterProvider router={router} />
}
