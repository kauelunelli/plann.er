import { CheckCircle2, CircleDashed, Crown, Mail, UserCog } from "lucide-react";
import { Button } from "@/components/button";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/axios";
import Modal from "@/components/modal";
import { Input } from "@/components/input";
import { DeleteButton } from "@/components/deleteButton";

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
  is_owner: boolean;
}

export function Guests() {
  const { tripId } = useParams();
  const [IsOpenModal, setIsOpenModal] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("TOKEN_KEY");

  useEffect(() => {
    api
      .get(`trips/${tripId}/participants`)
      .then((response) => setParticipants(response.data.participants));
  }, [tripId]);

  const deleteGuest = async (participantId: string) => {
    try {
      await api.delete(`/participants/${participantId}/remove`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setParticipants(
        participants.filter((participant) => participant.id !== participantId)
      );
    } catch (error) {
      console.error("Failed to delete participant", error);
    }
  };

  const addGuest = async () => {
    setIsLoading(true);
    try {
      await api.post(
        `/trips/${tripId}/add-participant`,
        {
          name,
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Failed to add participant", error);
    }
  };
  const closeModalGuest = () => {
    setIsOpenModal(false);
  };

  const openModalGuest = () => {
    setIsOpenModal(true);
  };

  const input = [
    {
      title: "Nome do convidado",
      type: "email",
      placeholder: "Nome",
      value: name,
      icon: UserCog,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
      },
    },
    {
      title: "Adicionar convidado",
      type: "email",
      placeholder: "example@mail.com",
      value: email,
      icon: Mail,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
      },
    },
  ];
  return (
    <div>
      <Modal
        title="Adicionar convidado"
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
        isOpen={IsOpenModal}
        onClose={closeModalGuest}
        size="large"
      >
        <div className="w-full h-px mb-5 bg-zinc-400"></div>

        {input.map((input, index) => (
          <Input
            key={index}
            title={input.title}
            type={input.type}
            placeholder={input.placeholder}
            icon={input.icon}
            value={input.value}
            onChange={input.onChange}
          />
        ))}

        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          onClick={() => addGuest()}
          size="full"
        >
          Adicionar
        </Button>
      </Modal>
      <div className="space-y-6">
        <h2 className="font-semibold text-xl">Convidados</h2>
        {participants.length === 0 && (
          <div className=" w-full mt-12">
            <p className="text-zinc-500 text-md">
              Nenhum participante cadastrado.
            </p>
          </div>
        )}

        <div className="space-y-5">
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              className="flex items-center w-full justify-between gap-4"
            >
              <div className="space-y-1.5">
                <span className=" font-medium flex items-center justify-between text-zinc-100">
                  {participant.name ?? `Convidado ${index}`}
                  {participant.is_owner && <Crown className="size-4" />}
                </span>
                <span className="block text-sm text-zinc-400 truncate">
                  {participant.email}
                </span>
              </div>
              <div className="text-zinc-400 flex space-x-4 shrink-0">
                {!participant.is_owner && (
                  <DeleteButton
                    isDisplayed={true}
                    onClick={() => deleteGuest(participant.id)}
                  />
                )}
                {participant.is_confirmed ? (
                  <CheckCircle2 className="text-green-400 size-5 shrink-0" />
                ) : (
                  <CircleDashed className="text-zinc-400 size-5 shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={openModalGuest} variant="secondary" size="full">
          <UserCog className="size-5" />
          Gerenciar convidados
        </Button>
      </div>
    </div>
  );
}
