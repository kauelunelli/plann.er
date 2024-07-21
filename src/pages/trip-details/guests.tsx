import { CheckCircle2, CircleDashed, Crown, UserCog } from "lucide-react";
import { Button } from "../../components/button";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
  is_owner: boolean;
}

export function Guests() {
  const { tripId } = useParams()
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    api.get(`trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))
  }, [tripId])

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>
      {participants.length === 0 && (
        <div className=" w-full mt-12">
          <p className="text-zinc-500 text-md">Nenhum participante cadastrado.</p>

        </div>
      )}

      <div className="space-y-5">
        {participants.map((participant, index) => (
          <div key={participant.id} className="flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className=" font-medium flex items-center justify-between text-zinc-100">{participant.name ?? `Convidado ${index}`}{participant.is_owner && (
              <Crown className="size-4" />
            )}</span>
              <span className="block text-sm text-zinc-400 truncate">
                {participant.email}
              </span>
            </div>
            {participant.is_confirmed ? (
              <CheckCircle2 className="text-green-400 size-5 shrink-0" />
            ) : (
              <CircleDashed className="text-zinc-400 size-5 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <Button variant="secondary" size="full">
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>
    </div>
  )
}