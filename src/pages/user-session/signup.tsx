import { useState } from "react";
import { api } from "../../lib/axios";
import { Button } from "../../components/button";
import { X } from "lucide-react";

interface signUpPageProps {
  closeSignupModal: () => void;
}

export function SignupPage({ closeSignupModal }: signUpPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/singup", {
        name,
        email,
        password,
      });
      localStorage.setItem("TOKEN_KEY", response.data.token);
      closeSignupModal();
    } catch (error) {
      console.error("Falha ao criar usuario", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      tabIndex={-1}
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full animate-fadeIn bg-black bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-zinc-900">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Crie sua conta
            </h3>
            <X
              className="end-2.5 rounded-lg hover:bg-gray-600 bg-transparent hover:text-zinc-400 transition-colors duration-300  cursor-pointer"
              onClick={closeSignupModal}
            />
          </div>
          <div className="p-4 md:p-5">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-zinc-300">
                  Nome
                </label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full p-2.5 text-base rounded-lg dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-gray-900 text-base rounded-lg block w-full p-2.5 border-gray-500 dark:placeholder-zinc-400 dark:text-white"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-zinc-300">
                  Your password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full p-2.5 text-base rounded-lg dark:border-gray-500 mb-10 dark:placeholder-gray-400 dark:text-white"
                />
              </div>
              <Button size="full" onClick={handleSignup}>
                {isLoading && (
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
                )}
                Criar conta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
