import { Calendar, Tag } from "lucide-react";
import { Button } from "../../components/button";
import { useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import Modal from "../../components/modal";
import { Input } from "../../components/input";

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void;
}

export function CreateActivityModal({
  closeCreateActivityModal,
}: CreateActivityModalProps) {
  const { tripId } = useParams();

  const [title, setTitle] = useState("");
  const [occurs_at, setOccurs_at] = useState("");

  async function createActivity() {
    await api.post(`/trips/${tripId}/activities`, {
      title,
      occurs_at,
    });
    closeCreateActivityModal();
    window.location.reload();
  }

  const inputs = [
    {
      type: "text",
      placeholder: "Qual a atividade?",
      value: title,
      icon: Tag,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
      },
    },
    {
      type: "datetime-local",
      placeholder: "Data e horário da atividade",
      value: occurs_at,
      icon: Calendar,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setOccurs_at(e.target.value);
      },
    },
  ];

  return (
    <Modal
      title="Cadastrar atividade"
      subtitle="Todos os convidados podem visualizar as atividades"
      isOpen={true}
      size="large"
      onClose={closeCreateActivityModal}
    >
      {inputs.map((input, index) => (
        <Input
          key={index}
          type={input.type}
          placeholder={input.placeholder}
          value={input.value}
          icon={input.icon}
          onChange={input.onChange}
        />
      ))}
      <Button onClick={createActivity} size="full">
        Salvar atividade
      </Button>
    </Modal>
  );
}
