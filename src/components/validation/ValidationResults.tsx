
import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/context/FilterContext";
import { toast } from "sonner";
import { generateConfigPDF } from "@/utils/PDFGenerator";

const ValidationResults: React.FC = () => {
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
      <div className="w-24 h-24 rounded-full bg-green-900/30 flex items-center justify-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-4">¡Configuración Válida!</h2>
      
      <p className="text-gray-300 text-center mb-8 max-w-md">
        Todos los componentes son compatibles entre sí y cumplen con los requisitos mínimos.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button 
          onClick={() => navigate("/builder")}
          className="
            bg-gradient-to-r from-green-600 to-emerald-600
            hover:from-green-700 hover:to-emerald-700
            text-white px-6 py-6 rounded-lg
            shadow-[0_0_15px_rgba(72,187,120,0.5)]
            hover:shadow-[0_0_25px_rgba(72,187,120,0.8)]
            transition-all duration-300
            text-lg w-full sm:w-auto
          "
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Volver al Builder
        </Button>
        
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
      </div>
    </div>
  );
};

export default ValidationResults;
