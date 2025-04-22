
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="space-y-6 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          PC Builder Pro
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300">
          Configura tu PC ideal con nuestro asistente inteligente
        </p>
        <Button
          onClick={() => navigate("/filters")}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 animate-scale-in"
        >
          <Settings className="mr-2" />
          Configurar PC
        </Button>
      </div>
    </div>
  );
}
