
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFilters } from "@/context/FilterContext";
import InteractiveBackground from "@/components/InteractiveBackground";
import ValidationProgress from "@/components/validation/ValidationProgress";
import ValidationResults from "@/components/validation/ValidationResults";
import { validateBuild } from "@/lib/axios";
import { toast } from "sonner";

export default function Validation() {
  const navigate = useNavigate();
  const { selectedComponents } = useFilters();
  const [validationComplete, setValidationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<{
    isValid: boolean;
    errors: string[];
    details: string[];
  }>({
    isValid: true,
    errors: [],
    details: []
  });

  const getComponentNames = () => {
    return Object.values(selectedComponents).map(component => component.Nombre);
  };

  useEffect(() => {
    // Simulamos progreso gradual
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    // Hacemos la validación real
    const componentNames = getComponentNames();
    
    if (componentNames.length === 0) {
      toast.error("No hay componentes seleccionados para validar");
      navigate("/builder");
      return;
    }

    const validateComponents = async () => {
      try {
        const results = await validateBuild(componentNames);
        
        // Una vez tenemos la respuesta, establecemos los resultados
        setValidationResults({
          isValid: results.isValid,
          errors: results.errors || [],
          details: results.details || []
        });
        
        // Completamos la barra de progreso y mostramos el resultado
        setProgress(100);
        setTimeout(() => {
          setValidationComplete(true);
        }, 500);
        
      } catch (error) {
        console.error("Error durante la validación:", error);
        toast.error("Error al validar la configuración. Intente nuevamente.");
        setProgress(100);
        setValidationResults({
          isValid: false,
          errors: ["Error al validar la configuración. Verifique la conexión con el servidor."],
          details: []
        });
        setTimeout(() => {
          setValidationComplete(true);
        }, 500);
      }
    };

    validateComponents();

    return () => {
      clearInterval(progressInterval);
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
            <ValidationResults 
              isValid={validationResults.isValid}
              errors={validationResults.errors}
              details={validationResults.details}
            />
          )}
        </div>
      </main>
    </div>
  );
}
