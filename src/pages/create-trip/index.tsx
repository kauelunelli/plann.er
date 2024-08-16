import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InviteGuestsModal } from "./invite-guests-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./steps/destination-and-date-step";
import { InviteGuestsStep } from "./steps/invite-guests-step";
import { DateRange } from "react-day-picker";
import { api } from "../../lib/axios";
import { LoginPage } from "../user-session/login";
import { Button } from "../../components/button";
import { SignupPage } from "../user-session/signup";

export function CreateTripPage() {
  const navigate = useNavigate();
  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSingupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailsToInvite, setEmailsToInvite] = useState([
    "diego@rocketseat.com.br",
    "john@acme.com",
  ]);

  const [destination, setDestination] = useState("");
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();

  function isLogged() {
    if (localStorage.getItem("TOKEN_KEY")) {
      return true;
    } else {
      openLoginModal();
    }
    return false;
  }

  function openSignupModal() {
    setIsLoginOpen(false);
    setIsSingupOpen(true);
  }
  function closeSignupModal() {
    setIsSingupOpen(false);
  }

  function openGuestsInput() {
    if (isLogged()) {
      setIsGuestsInputOpen(true);
    }
  }

  function travelPage() {
    if (isLogged()) {
      navigate("/trips");
    }
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false);
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true);
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false);
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true);
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false);
  }

  function openLoginModal() {
    setIsLoginOpen(true);
  }

  function closeLoginModal() {
    setIsLoginOpen(false);
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    if (!email) {
      return;
    }

    if (emailsToInvite.includes(email)) {
      return;
    }

    setEmailsToInvite([...emailsToInvite, email]);

    event.currentTarget.reset();
  }

  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(
      (email) => email !== emailToRemove
    );

    setEmailsToInvite(newEmailList);
  }

  async function createTrip() {
    setIsLoading(true);
    if (!destination) {
      setIsLoading(false);
      return;
    }

    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
      setIsLoading(false);
      return;
    }

    if (emailsToInvite.length === 0) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("TOKEN_KEY");
    try {
      const response = await api.post(
        "/trips",
        {
          destination,
          starts_at: eventStartAndEndDates?.from,
          ends_at: eventStartAndEndDates?.to,
          emails_to_invite: emailsToInvite,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { tripId } = response.data;
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="fixed end-7 m-10">
        {isLoginOpen && (
          <LoginPage
            openSignupModal={openSignupModal}
            closeLoginModal={closeLoginModal}
          />
        )}
        {isSignupOpen && <SignupPage closeSignupModal={closeSignupModal} />}
        <Button onClick={travelPage}>Minhas Viagens</Button>
      </div>

      <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
        <div className="max-w-3xl w-full px-6 text-center space-y-10">
          <div className="flex flex-col items-center gap-3">
            <img src="/logo.svg" alt="plann.er" />
            <p className="text-zinc-300 text-lg">
              Convide seus amigos e planeje sua próxima viagem!
            </p>
          </div>

          <div className="space-y-4">
            <DestinationAndDateStep
              closeGuestsInput={closeGuestsInput}
              isGuestsInputOpen={isGuestsInputOpen}
              openGuestsInput={openGuestsInput}
              setDestination={setDestination}
              setEventStartAndEndDates={setEventStartAndEndDates}
              eventStartAndEndDates={eventStartAndEndDates}
            />

            {isGuestsInputOpen && (
              <InviteGuestsStep
                emailsToInvite={emailsToInvite}
                openConfirmTripModal={openConfirmTripModal}
                openGuestsModal={openGuestsModal}
              />
            )}
          </div>

          <p className="text-sm text-zinc-500">
            Ao planejar sua viagem pela plann.er você automaticamente concorda{" "}
            <br />
            com nossos{" "}
            <a className="text-zinc-300 underline" href="#">
              termos de uso
            </a>{" "}
            e{" "}
            <a className="text-zinc-300 underline" href="#">
              políticas de privacidade
            </a>
            .
          </p>
        </div>

        {isGuestsModalOpen && (
          <InviteGuestsModal
            emailsToInvite={emailsToInvite}
            addNewEmailToInvite={addNewEmailToInvite}
            closeGuestsModal={closeGuestsModal}
            removeEmailFromInvites={removeEmailFromInvites}
          />
        )}

        {isConfirmTripModalOpen && (
          <ConfirmTripModal
            closeConfirmTripModal={closeConfirmTripModal}
            createTrip={createTrip}
            destination={destination}
            eventStartAndEndDates={eventStartAndEndDates}
            isLoading={isLoading}
            emailsToInvite={emailsToInvite}
          />
        )}
      </div>
    </div>
  );
}
