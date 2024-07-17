import { X } from "lucide-react";
import { Button } from "../../components/button";
import { DateRange } from "react-day-picker";
import { useState } from "react";

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  createTrip: () => void;
  destination: string;
  eventStartAndEndDates: DateRange | undefined;
  emailsToInvite: string[];
}

export function ConfirmTripModal({
  closeConfirmTripModal,
  createTrip,
  destination,
  eventStartAndEndDates,
  emailsToInvite,
}: ConfirmTripModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  function sendCreateTripAndStartLoading() {
    setIsLoading(true);
    createTrip();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-lg font-semibold">
              Confirmar criação de viagem
            </h2>
            <button>
              <X
                className="size-5 text-zinc-400"
                onClick={closeConfirmTripModal}
              />
            </button>
          </div>

          <p className="text-lg text-zinc-400">
            Verifique se todas as informações estão corretas antes de confirmar
            a criação da viagem.
          </p>
          <div className="space-y-3">
            <p className="text-lg text-white block p-4  border rounded-lg shadow bg-zinc-700 border-gray-700 ">
              <strong>Local:</strong> {destination}
            </p>
            <p className="text-lg text-white block  p-4  border rounded-lg shadow bg-zinc-700 border-gray-700 ">
              <strong>Datas:</strong>{" "}
              {eventStartAndEndDates?.to && eventStartAndEndDates?.from
                ? `${eventStartAndEndDates.from.toLocaleDateString(
                    "pt-BR"
                  )} até ${eventStartAndEndDates.to.toLocaleDateString(
                    "pt-BR"
                  )}`
                : "Não definido"}
            </p>
            <p className="text-lg text-white block  p-4  border rounded-lg shadow bg-zinc-700 border-gray-700 ">
              <strong>Passageiros:</strong> {emailsToInvite.join(", ")}
            </p>
          </div>
        </div>

        <Button onClick={sendCreateTripAndStartLoading} disabled={isLoading} size="full">
        {isLoading && 
                <svg
                  className="animate-spin h-5 w-5 mr-3 ..."
                  viewBox="0 0 24 24"
                >
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                }
          Confirmar criação da viagem
        </Button>
      </div>
    </div>
  );
}
