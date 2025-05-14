
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import InteractiveBackground from "@/components/InteractiveBackground";
import ValidationProgress from "@/components/validation/ValidationProgress";
import ValidationResults from "@/components/validation/ValidationResults";

export default function Validation() {
  const navigate = useNavigate();
  const [validationComplete, setValidationComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate validation progress
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setValidationComplete(true);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 150);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <InteractiveBackground />
      
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4 text-white hover:bg-white/10"
            onClick={() => navigate("/builder")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Validación de Compatibilidad</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-16 flex flex-col items-center">
        <div className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center">
          {!validationComplete ? (
            <ValidationProgress progress={progress} />
          ) : (
            <ValidationResults />
          )}
        </div>
      </main>
    </div>
  );
}
