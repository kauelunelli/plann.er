import { Book, Link2, Plus } from "lucide-react";
import { Button } from "../../components/button";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import Modal from "../../components/modal";
import { useParams } from "react-router-dom";
import { Input } from "../../components/input";
import { DeleteButton } from "../../components/deleteButton";

interface Link {
  title: string;
  url: string;
}

export function ImportantLinks() {
  const { tripId } = useParams();
  const [links, setLinks] = useState<Link[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    api
      .get(`/trips/${tripId}/links`)
      .then((response) => setLinks(response.data));
  }, [tripId]);

  const createLink = async () => {
    setIsLoading(true);
    try {
      await api.post(`/trips/${tripId}/links`, {
        title,
        url,
      });
      setLinks([...links, { title, url }]);
      setIsOpenModal(false);
    } catch (error) {
      console.error("Failed to create link", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLink = async (tripId: string) => {
    try {
      await api.delete(`/trips/${tripId}/links`);
      setLinks(links.filter((link) => link.title !== title));
    } catch (error) {
      console.error("Failed to delete link", error);
    }
  };

  const closeModalLink = () => {
    setIsOpenModal(false);
  };

  const openModalLink = () => {
    setIsOpenModal(true);
  };

  const handleMouseEnterToDisplayDelete = (index: number) => {
    setHoveredIndex(index);
  };
  const handleMouseLeaveToDisplayDelete = () => {
    setHoveredIndex(null);
  };

  const inputs = [
    {
      title: "Título",
      type: "text",
      placeholder: "Ex: Documentação da viagem",
      value: title,
      icon: Book,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
      },
    },
    {
      title: "URL",
      type: "text",
      placeholder: "https://",
      value: url,
      icon: Link2,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
      },
    },
  ];

  return (
    <div>
      <Modal isOpen={isOpenModal} title="Novo link" onClose={closeModalLink}>
        {inputs.map((input, index) => (
          <Input
            key={index}
            title={input.title}
            type={input.type}
            placeholder={input.placeholder}
            value={input.value}
            icon={input.icon}
            onChange={input.onChange}
          />
        ))}
        <div className="flex justify-between">
          <div className="flex items-start"></div>
        </div>
        <Button size="full" onClick={createLink} isLoading={isLoading}>
          Cadastrar link
        </Button>
      </Modal>
      <div className="space-y-6">
        <h2 className="font-semibold text-xl">Links importantes</h2>

        <div className="space-y-5">
          {links.length > 0 ? (
            links.map((link, index) => (
              <div
                className="flex items-center gap-4"
                onMouseEnter={() => handleMouseEnterToDisplayDelete(index)}
                onMouseLeave={handleMouseLeaveToDisplayDelete}
              >
                <div className="space-y-1.5 w-full">
                  <span className="block font-medium text-zinc-100">
                    {link.title}
                  </span>
                  <a
                    href={link.url}
                    className="block text-xs text-zinc-400 truncate hover:text-zinc-200"
                  >
                    {link.url}
                  </a>
                </div>
                {hoveredIndex === index && (
                  <DeleteButton
                    isDisplayed={true}
                    onClick={() => deleteLink(link.title)}
                  />
                )}

                <Link2 className="text-zinc-400 size-5 justify-end shrink-0" />
              </div>
            ))
          ) : (
            <p className="text-zinc-400">Nenhum link cadastrado</p>
          )}
        </div>

        <Button onClick={openModalLink} variant="secondary" size="full">
          <Plus className="size-5" />
          Cadastrar novo link
        </Button>
      </div>
    </div>
  );
}
