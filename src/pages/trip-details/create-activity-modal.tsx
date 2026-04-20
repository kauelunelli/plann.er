import { Calendar, Tag } from "lucide-react";
import { Button } from "../../components/button";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import Modal from "../../components/modal";
import { Input } from "../../components/input";
import { notify } from "../../lib/toast-service";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void;
  activityToEdit?: {
    id: string;
    title: string;
    occurs_at: string;
  };
  onSaved?: () => void;
}

export function CreateActivityModal({
  closeCreateActivityModal,
  activityToEdit,
  onSaved,
}: CreateActivityModalProps) {
  const { tripId } = useParams();
  const token = localStorage.getItem("TOKEN_KEY");

  const [title, setTitle] = useState(activityToEdit?.title ?? "");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    activityToEdit ? new Date(activityToEdit.occurs_at) : undefined
  );
  const [selectedTime, setSelectedTime] = useState(
    activityToEdit
      ? `${String(new Date(activityToEdit.occurs_at).getHours()).padStart(2, "0")}:${String(
          new Date(activityToEdit.occurs_at).getMinutes()
        ).padStart(2, "0")}`
      : "12:00"
  );
  const [tripDateRange, setTripDateRange] = useState<{
    starts_at: Date;
    ends_at: Date;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!tripId) {
      return;
    }

    api.get(`/trips/${tripId}`).then((response) => {
      setTripDateRange({
        starts_at: new Date(response.data.trip.starts_at),
        ends_at: new Date(response.data.trip.ends_at),
      });
    });
  }, [tripId]);

  const selectedDateTimeLabel = useMemo(() => {
    if (!selectedDate) {
      return "Selecione a data da atividade";
    }

    return `${selectedDate.toLocaleDateString("pt-BR")} as ${selectedTime}`;
  }, [selectedDate, selectedTime]);

  function buildOccursAt() {
    if (!selectedDate) {
      return null;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    return dateTime;
  }

  async function createActivity() {
    if (!title.trim()) {
      notify("Informe o titulo da atividade.");
      return;
    }

    const occursAt = buildOccursAt();

    if (!occursAt) {
      notify("Informe data e horario da atividade.");
      return;
    }

    setIsLoading(true);
    try {
      if (activityToEdit) {
        await api.put(
          `/activities/${activityToEdit.id}`,
          {
            title,
            occurs_at: occursAt,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await api.post(`/trips/${tripId}/activities`, {
          title,
          occurs_at: occursAt,
        });
      }

      onSaved?.();
      closeCreateActivityModal();
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title={activityToEdit ? "Editar atividade" : "Cadastrar atividade"}
      subtitle="Todos os convidados podem visualizar as atividades"
      isOpen={true}
      size="large"
      onClose={closeCreateActivityModal}
    >
      <Input
        type="text"
        placeholder="Qual a atividade?"
        value={title}
        icon={Tag}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">
          Data da atividade
        </label>
        <div className="h-14 px-4 bg-zinc-950 border text-zinc-400 border-zinc-800 rounded-lg flex items-center gap-2">
          <Calendar className="size-5" />
          <span className="text-lg">{selectedDateTimeLabel}</span>
        </div>
      </div>

      {tripDateRange && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={[
              { before: tripDateRange.starts_at },
              { after: tripDateRange.ends_at },
            ]}
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">Horario</label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="h-14 w-full px-4 bg-zinc-950 border text-zinc-400 border-zinc-800 rounded-lg"
        />
      </div>

      <Button onClick={createActivity} size="full" isLoading={isLoading} isDisabled={isLoading}>
        {activityToEdit ? "Salvar alteracoes" : "Salvar atividade"}
      </Button>
    </Modal>
  );
}
