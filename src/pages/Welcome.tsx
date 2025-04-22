
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white p-4">
      <div className="space-y-6 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          PC Builder Pro
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-90">
          Configura tu PC ideal con nuestro asistente inteligente
        </p>
        <Button
          onClick={() => navigate("/filters")}
          size="lg"
          className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200 animate-scale-in"
        >
          <Settings className="mr-2" />
          Configurar PC
        </Button>
      </div>
    </div>
  );
}
