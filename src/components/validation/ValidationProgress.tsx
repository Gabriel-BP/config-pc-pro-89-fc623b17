
import React from "react";
import { CheckCircle } from "lucide-react";

interface ValidationProgressProps {
  progress: number;
}

const ValidationProgress: React.FC<ValidationProgressProps> = ({ progress }) => {
  // List of components that we check during validation
  const validationComponents = ["Procesador", "Placa base", "Memoria RAM", "Tarjeta gráfica", "Refrigeración"];
  
  return (
    <>
      <div className="text-2xl font-bold text-white mb-8">
        Verificando compatibilidad de componentes...
      </div>
      
      <div className="w-full bg-gray-800 rounded-full h-4 mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
        {validationComponents.map((component, index) => (
          <div 
            key={component}
            className={`
              flex items-center gap-2 p-3 rounded-lg
              ${progress > 20 * index ? "text-green-400" : "text-gray-400"}
              ${progress > 20 * index ? "bg-green-900/20" : "bg-gray-800/30"}
              transition-all duration-500 border border-white/5
            `}
          >
            {progress > 20 * index && <CheckCircle className="h-4 w-4" />}
            <span>{component}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ValidationProgress;
