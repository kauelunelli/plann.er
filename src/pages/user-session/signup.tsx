import { useState } from "react";
import { api } from "../../lib/axios";
import { Button } from "../../components/button";
import Modal from "../../components/modal";
import { Input } from "../../components/input";

interface signUpPageProps {
  closeSignupModal: () => void;
}

export function SignupPage({ closeSignupModal }: signUpPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputs = [
    {
      title: "Nome",
      type: "text",
      placeholder: "Seu nome",
      value: name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
      },
    },
    {
      title: "Email",
      type: "email",
      placeholder: "",
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
      },
    },
    {
      title: "Senha",
      type: "password",
      placeholder: "",
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
      },
    },
  ];

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
    <div>
      <Modal isOpen={true} title="Faça Cadastro" onClose={closeSignupModal}>
        {inputs.map((input, index) => (
          <Input
            key={index}
            title={input.title}
            type={input.type}
            placeholder={input.placeholder}
            value={input.value}
            onChange={input.onChange}
          />
        ))}
        <div className="w-full h-px mb-5 bg-zinc-400"></div>
        <Button isLoading={isLoading} size="full" onClick={handleSignup}>
          Criar conta
        </Button>
      </Modal>
    </div>
  );
}
