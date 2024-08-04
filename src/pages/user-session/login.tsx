import { useState } from "react";
import { api } from "../../lib/axios";
import { Button } from "../../components/button";
import Modal from "../../components/modal";
import { Lock, Mail } from "lucide-react";
import { Input } from "../../components/input";

interface LoginPageProps {
  closeLoginModal: () => void;
  openSignupModal: () => void;
}

export function LoginPage({
  closeLoginModal,
  openSignupModal,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputs = [
    {
      title: "Email",
      type: "email",
      placeholder: "",
      value: email,
      icon: Mail,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
      },
    },
    {
      title: "Password",
      type: "password",
      placeholder: "",
      value: password,
      icon: Lock,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
      },
    },
  ];

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      localStorage.setItem("TOKEN_KEY", response.data.token);
      closeLoginModal();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Modal isOpen={true} title="Faça Login" onClose={closeLoginModal}>
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
          <a href="#" className="text-sm hover:underline dark:text-lime-500">
            Esqueceu a senha?
          </a>
        </div>
        <Button onClick={handleLogin} isLoading={isLoading}>
          Entrar na sua conta
        </Button>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
          Não cadastrado?{" "}
          <a
            onClick={openSignupModal}
            className="hover:underline text-lime-500"
          >
            Crie sua conta
          </a>
        </div>
      </Modal>
    </div>
  );
}
