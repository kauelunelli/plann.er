import { Button } from "@/components/button";
import { DateRange } from "react-day-picker";
import Modal from "@/components/modal";

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  createTrip: () => void;
  destination: string;
  eventStartAndEndDates: DateRange | undefined;
  isLoading: boolean;
  emailsToInvite: string[];
}

export function ConfirmTripModal({
  closeConfirmTripModal,
  createTrip,
  destination,
  eventStartAndEndDates,
  emailsToInvite,
  isLoading,
}: ConfirmTripModalProps) {
  async function sendCreateTripAndStartLoading() {
    createTrip();
  }

  return (
    <Modal
      isOpen={true}
      title="Confirmar criação de viagem"
      onClose={closeConfirmTripModal}
      subtitle="Verifique se todas as informações estão corretas antes de confirmar a criação da viagem."
      size="large"
    >
      <div className="space-y-3">
        <p className="text-lg text-white block p-4  border rounded-lg shadow bg-zinc-700 border-gray-700 ">
          <strong>Local:</strong> {destination}
        </p>
        <p className="text-lg text-white block  p-4  border rounded-lg shadow bg-zinc-700 border-gray-700 ">
          <strong>Datas:</strong>{" "}
          {eventStartAndEndDates?.to && eventStartAndEndDates?.from
            ? `${eventStartAndEndDates.from.toLocaleDateString(
                "pt-BR"
              )} até ${eventStartAndEndDates.to.toLocaleDateString("pt-BR")}`
            : "Não definido"}
        </p>
        <p className="text-lg text-white block  p-4  border rounded-lg shadow bg-zinc-700 border-gray-700 ">
          <strong>Passageiros:</strong> {emailsToInvite.join(", ")}
        </p>
      </div>

      <Button
        onClick={sendCreateTripAndStartLoading}
        isLoading={isLoading}
        isDisabled={isLoading}
        size="full"
      >
        Confirmar criação da viagem
      </Button>
    </Modal>
  );
}
