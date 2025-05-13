
import { useFilters } from "@/context/FilterContext";
import { ProcessorSelector } from "./ProcessorSelector";
import MotherboardSelector from "./MotherboardSelector";
import GpuSelector from "./GpuSelector";

export function FiltersSidebar() {
  const { filters, setFilters } = useFilters();
  
  // Handlers para cada tipo de filtro
  const handleProcessorChange = (brand: "intel" | "amd" | null) => {
    setFilters(prev => ({ ...prev, processorBrand: brand }));
  };
  
  const handleSocketChange = (socket: "am4" | "am5" | "lga1200" | "lga1700" | "lga1851" | null) => {
    setFilters(prev => ({ ...prev, socket }));
  };
  
  const handleGpuChange = (brand: "nvidia" | "amd" | null) => {
    setFilters(prev => ({ ...prev, gpuBrand: brand }));
  };
  
  const handleMotherboardSizeChange = (size: "ATX" | "Micro-ATX" | "Mini-ITX" | null) => {
    setFilters(prev => ({ ...prev, motherboardSize: size }));
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-8">
      <h2 className="text-2xl font-semibold text-white">Filtros</h2>
      
      <div className="space-y-12">
        <ProcessorSelector 
          processorBrand={filters.processorBrand}
          socket={filters.socket}
          onProcessorChange={handleProcessorChange}
          onSocketChange={handleSocketChange}
        />
        
        <MotherboardSelector 
          motherboardSize={filters.motherboardSize}
          onMotherboardSizeChange={handleMotherboardSizeChange}
        />
        
        <GpuSelector 
          gpuBrand={filters.gpuBrand}
          onGpuChange={handleGpuChange}
        />
      </div>
    </div>
  );
}
