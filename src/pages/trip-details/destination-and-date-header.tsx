import { MapPin, Calendar, Settings2 } from "lucide-react";
import { Button } from "@/components/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { format } from "date-fns";
import Modal from "@/components/modal";
import { Input } from "@/components/input";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { notify } from "@/lib/toast-service";
import axios from "axios";

interface Trip {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [eventDateRange, setEventDateRange] = useState<DateRange | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem("TOKEN_KEY");

  function loadTrip() {
    api.get(`trips/${tripId}`).then((response) => {
      const loadedTrip = response.data.trip as Trip;
      setTrip(loadedTrip);
      setDestination(loadedTrip.destination);
      setEventDateRange({
        from: new Date(loadedTrip.starts_at),
        to: new Date(loadedTrip.ends_at),
      });
    });
  }

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const displayedDate = trip
    ? format(trip.starts_at, "d' de 'LLL")
        .concat(" até ")
        .concat(format(trip.ends_at, "d' de 'LLL"))
    : null;

  async function updateTrip() {
    if (!destination.trim()) {
      notify("Informe o destino da viagem.");
      return;
    }

    if (!eventDateRange?.from || !eventDateRange?.to) {
      notify("Selecione data de inicio e fim da viagem.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put(
        `/trips/${tripId}`,
        {
          destination,
          starts_at: eventDateRange.from,
          ends_at: eventDateRange.to,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditModalOpen(false);
      loadTrip();

      // Atualiza componentes que dependem do periodo da viagem (ex: lista de atividades).
      window.dispatchEvent(
        new CustomEvent("trip:updated", {
          detail: {
            tripId,
            deletedActivities: response.data?.deletedActivities ?? 0,
          },
        })
      );

      const deletedActivities = response.data?.deletedActivities ?? 0;
      if (deletedActivities > 0) {
        notify(
          `Viagem atualizada. ${deletedActivities} atividade(s) fora do novo periodo foram removidas.`,
          "info"
        );
        return;
      }

      notify("Viagem atualizada com sucesso.", "success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorCode = error.response?.data?.code;
        const errorMessage = error.response?.data?.message;

        if (errorCode === "TRIP_UPDATE_WOULD_DELETE_ACTIVITIES") {
          const shouldDelete = window.confirm(
            `${errorMessage}. Deseja continuar e remover essas atividades?`
          );

          if (shouldDelete) {
            await api.put(
              `/trips/${tripId}`,
              {
                destination,
                starts_at: eventDateRange.from,
                ends_at: eventDateRange.to,
                delete_out_of_range_activities: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setIsEditModalOpen(false);
            loadTrip();
            window.dispatchEvent(
              new CustomEvent("trip:updated", {
                detail: {
                  tripId,
                },
              })
            );
            notify("Viagem atualizada e atividades fora do periodo foram removidas.", "success");
          }
        }
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{trip?.destination}</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-zinc-400" />
            <span className="text-zinc-100">{displayedDate}</span>
          </div>

          <div className="w-px h-6 bg-zinc-800" />

          <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
            Alterar local/data
            <Settings2 className="size-5" />
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        title="Alterar local e data"
        subtitle="Edite as informacoes da viagem"
        onClose={() => setIsEditModalOpen(false)}
        size="large"
      >
        <Input
          type="text"
          title="Destino"
          placeholder="Para onde voce vai?"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <DayPicker mode="range" selected={eventDateRange} onSelect={setEventDateRange} />
        </div>

        <Button size="full" onClick={updateTrip} isLoading={isSaving} isDisabled={isSaving}>
          Salvar alteracoes
        </Button>
      </Modal>
    </>
  );
}
