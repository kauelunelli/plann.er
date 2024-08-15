import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { DeleteButton } from "@/components/deleteButton";
import { LandPlot, LogOut, Plane, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/button";
import { LoginPage } from "./login";
import { SignupPage } from "./signup";

interface User {
  name: string;
  email: string;
  trips: Trip[];
}

interface Trip {
  id: string;
  destination: string;
}

export function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({ name: "", email: "", trips: [] });
  const [showTrips, setShowTrips] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSingupOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const token = localStorage.getItem("TOKEN_KEY");

  const deleteTrip = (tripId: string) => {
    api
      .delete(`/trips/${tripId}/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setUser((prevState) => ({
          ...prevState,
          trips: prevState.trips.filter((trip) => trip.id !== tripId),
        }));
      });
  };

  const handleLogout = () => {
    if (!token) {
      navigate("/");
    }
    localStorage.removeItem("TOKEN_KEY");
    navigate("/");
  };
  const handleChangeTrip = (tripId: string) => {
    navigate(`/trips/${tripId}`);
  };

  const changeShowTrips = () => {
    setShowTrips(!showTrips);
  };

  function openSignupModal() {
    setIsLoginOpen(false);
    setIsSingupOpen(true);
  }
  function closeSignupModal() {
    setIsSingupOpen(false);
  }

  function closeLoginModal() {
    setIsLoginOpen(false);
  }

  const handleMouseEnterToDisplayDelete = (index: number) => {
    setHoveredIndex(index);
  };
  const handleMouseLeaveToDisplayDelete = () => {
    setHoveredIndex(null);
  };

  useEffect(() => {
    if (token) {
      api
        .get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setUser(response.data.user));
    }
  }, [token]);

  return (
    <div className="z-40 w-1/6 h-screen  bg-zinc-800">
      {isLoginOpen && (
        <LoginPage
          openSignupModal={openSignupModal}
          closeLoginModal={closeLoginModal}
        />
      )}
      {isSignupOpen && <SignupPage closeSignupModal={closeSignupModal} />}
      <aside>
        <div className="h-full px-12 py-8  bg-zinc-800">
          <a href="/" className="flex items-center ps-2.5 mb-5">
            <img src="/logo.svg" alt="plann.er" className="h-6  sm:h-8" />
          </a>
          <div className="w-full h-px mb-5 bg-white"></div>
          <ul className="space-y-3 font-medium">
            {user.email ? (
              <>
                <li className="flex items-center p-2">
                  <User className="size-5" />
                  <span className="ms-3">Olá, {user.name}</span>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <LogOut className="size-5" />

                    <span className="ms-3">Sair</span>
                  </a>
                </li>
              </>
            ) : (
              <li>
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  size="full"
                  className="text-gray-500"
                >
                  Faça Login
                </Button>
              </li>
            )}
            <div className="w-full h-px bg-white"></div>
            <li>
              <button
                onClick={() => navigate("/")}
                className="bg-lime-300 mt-5 text-lime-950 rounded-lg px-5 py-2 w-full font-medium flex items-center gap-2 hover:bg-lime-400"
              >
                <Plus className="size-5" />
                Nova viagem
              </button>
            </li>
            <li>
              <a
                onClick={changeShowTrips}
                className="flex items-center cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <Plane className="size-5" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Minhas viagens
                </span>
              </a>
            </li>
            {showTrips && (
              <ol>
                {user.trips.length > 0 ? (
                  user.trips.toReversed().map((trip, index) => (
                    <li
                      key={trip.id}
                      onMouseEnter={() =>
                        handleMouseEnterToDisplayDelete(index)
                      }
                      onMouseLeave={handleMouseLeaveToDisplayDelete}
                    >
                      <div className="flex items-center justify-between rounded-lg text-white p-2 hover:bg-zinc-700">
                        <a
                          onClick={() => handleChangeTrip(trip.id)}
                          className="flex items-center p-2 cursor-pointer "
                        >
                          <LandPlot className="size-5" />
                          <span className="ms-3">{trip.destination}</span>
                        </a>
                        {hoveredIndex === index && (
                          <DeleteButton
                            isDisplayed={true}
                            onClick={() => deleteTrip(trip.id)}
                          />
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="text-gray-500">
                      Nenhuma viagem cadastrada.
                    </span>
                  </li>
                )}
              </ol>
            )}
            <div className="w-full h-px my-5 bg-white"></div>
          </ul>
        </div>
      </aside>
    </div>
  );
}
