
import { useState } from "react";
import { api } from "../../lib/axios";
import { useNavigate} from "react-router-dom";
import { Button } from "../../components/button";
import { ArrowRight } from "lucide-react";


export function LoginPage() {
const navigate = useNavigate()
const [email, setUsername] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    console.log("Logged in successfully", response.data);
    
    localStorage.setItem("TOKEN_KEY", response.data.token);
    navigate(`/`);
  } catch (error) {
    console.error("Login failed", error);
  }
};

return (
  <div className="h-screen flex justify-center items-center">
    <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
      <div className="flex items-center gap-2 flex-1">
        <input
          type="text"
          placeholder="Login"
          className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
          onChange={(e) => setPassword(e.target.value)}
        />
          <Button onClick={handleLogin}>
          Continuar
          <ArrowRight className="size-5" />
        </Button>
      </div>
    </div>
  </div>
);

  
}