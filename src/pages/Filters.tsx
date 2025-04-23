
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InteractiveBackground from "@/components/InteractiveBackground";
import ProcessorSelector from "@/components/filters/ProcessorSelector";
import GpuSelector from "@/components/filters/GpuSelector";
import MotherboardSelector from "@/components/filters/MotherboardSelector";
import { useFilters } from "@/context/FilterContext";
import { toast } from "sonner";

type ProcessorBrand = "intel" | "amd" | null;
type SocketType = "am4" | "am5" | "lga1200" | "lga1700" | "lga1851" | null;
type GpuBrand = "nvidia" | "amd" | null;
type MotherboardSize = "atx" | "micro-atx" | "mini-itx" | null;

export default function Filters() {
  const navigate = useNavigate();
  const { filters, setFilters } = useFilters();
  
  const [processorBrand, setProcessorBrand] = useState<ProcessorBrand>(filters.processorBrand);
  const [socket, setSocket] = useState<SocketType>(filters.socket);
  const [gpuBrand, setGpuBrand] = useState<GpuBrand>(filters.gpuBrand);
  const [motherboardSize, setMotherboardSize] = useState<MotherboardSize>(filters.motherboardSize);

  const handleContinue = () => {
    // Only include selected filters (non-null values)
    const newFilters = {
      ...(processorBrand && { processorBrand }),
      ...(socket && { socket }),
      ...(gpuBrand && { gpuBrand }),
      ...(motherboardSize && { motherboardSize })
    };
    
    setFilters(newFilters);
    
    const hasFilters = Object.keys(newFilters).length > 0;
    if (hasFilters) {
      toast.success("Filtros aplicados");
    }
    
    navigate("/builder");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <InteractiveBackground />
      <div className="relative z-10 min-h-screen bg-transparent p-8">
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Configura tus preferencias
          </h1>

          <div className="space-y-12">
            <ProcessorSelector
              processorBrand={processorBrand}
              socket={socket}
              onProcessorChange={setProcessorBrand}
              onSocketChange={setSocket}
            />

            <GpuSelector gpuBrand={gpuBrand} onGpuChange={setGpuBrand} />

            <MotherboardSelector
              motherboardSize={motherboardSize}
              onMotherboardSizeChange={setMotherboardSize}
            />
          </div>

          <Button
            onClick={handleContinue}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 animate-scale-in"
          >
            Continuar a la configuración
          </Button>
        </div>
      </div>
    </div>
  );
}
