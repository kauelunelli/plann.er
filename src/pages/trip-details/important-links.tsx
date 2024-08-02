import { Link2, Plus } from "lucide-react";
import { Button } from "../../components/button";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import Modal from "../../components/modal";
import { useParams } from "react-router-dom";

interface Link {
  title: string;
  url: string;
}

export function ImportantLinks() {
  const { tripId } = useParams();
  const [links, setLinks] = useState<Link[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [title, setTitle] = useState("");
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

  const closeModalLink = () => {
    setIsOpenModal(false);
  };

  const openModalLink = () => {
    setIsOpenModal(true);
  };

  return (
    <div>
      <Modal isOpen={isOpenModal} title="Novo link" onClose={closeModalLink}>
        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Título
          </label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            className="text-gray-900 text-base rounded-lg block w-full p-2.5 border-gray-500 dark:placeholder-zinc-400 dark:text-white"
            placeholder="Ex: Documentação da viagem"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            URL
          </label>
          <input
            type="text"
            placeholder="https://"
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full p-2.5 text-base rounded-lg dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          />
        </div>
        <div className="flex justify-between">
          <div className="flex items-start"></div>
        </div>
        <Button onClick={createLink} isLoading={isLoading}>
          Cadastrar link
        </Button>
      </Modal>
      <div className="space-y-6">
        <h2 className="font-semibold text-xl">Links importantes</h2>

        <div className="space-y-5">
          {links.length > 0 ? (
            links.map((link) => (
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
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

                <Link2 className="text-zinc-400 size-5 shrink-0" />
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
