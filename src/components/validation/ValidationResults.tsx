
import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/context/FilterContext";
import { toast } from "sonner";
import { generateConfigPDF } from "@/utils/PDFGenerator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ValidationResultsProps {
  isValid: boolean;
  errors: string[];
  details: string[];
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ isValid, errors, details }) => {
  const navigate = useNavigate();
  const { selectedComponents } = useFilters();
  
  const handleDownloadPDF = () => {
    const result = generateConfigPDF(selectedComponents);
    if (result) {
      toast.success("PDF descargado correctamente");
    }
  };
  
  return (
    <div className="flex flex-col items-center animate-scale-in">
      <div className={`w-24 h-24 rounded-full ${isValid ? 'bg-green-900/30' : 'bg-red-900/30'} flex items-center justify-center mb-6`}>
        {isValid ? (
          <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
        ) : (
          <AlertTriangle className="h-16 w-16 text-red-500 animate-pulse" />
        )}
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-4">
        {isValid ? "¡Configuración Válida!" : "Configuración Inválida"}
      </h2>
      
      {isValid ? (
        <p className="text-gray-300 text-center mb-8 max-w-md">
          Todos los componentes son compatibles entre sí y cumplen con los requisitos mínimos.
        </p>
      ) : (
        <div className="w-full max-w-md mb-8">
          <Alert variant="destructive" className="bg-red-900/20 border-red-800 mb-4">
            <AlertTitle className="text-red-300">Problemas de compatibilidad detectados</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-200">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
          
          {details.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="text-gray-300 font-medium mb-2">Detalles adicionales:</h3>
              <ul className="text-gray-400 text-sm">
                {details.map((detail, index) => (
                  <li key={index} className="mb-1">{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button 
          onClick={() => navigate("/builder")}
          className={`
            ${isValid 
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-[0_0_15px_rgba(72,187,120,0.5)] hover:shadow-[0_0_25px_rgba(72,187,120,0.8)]" 
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-[0_0_15px_rgba(66,153,225,0.5)] hover:shadow-[0_0_25px_rgba(66,153,225,0.8)]"
            }
            text-white px-6 py-6 rounded-lg
            transition-all duration-300
            text-lg w-full sm:w-auto
          `}
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          {isValid ? "Finalizar" : "Volver al Builder"}
        </Button>
        
        {isValid && (
          <Button 
            onClick={handleDownloadPDF}
            className="
              bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700
              text-white px-6 py-6 rounded-lg
              shadow-[0_0_15px_rgba(66,153,225,0.5)]
              hover:shadow-[0_0_25px_rgba(66,153,225,0.8)]
              transition-all duration-300
              text-lg w-full sm:w-auto
            "
          >
            <Download className="mr-2 h-5 w-5" />
            Descargar Build
          </Button>
        )}
      </div>
    </div>
  );
};

export default ValidationResults;
