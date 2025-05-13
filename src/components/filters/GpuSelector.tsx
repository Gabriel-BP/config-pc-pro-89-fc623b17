
import { Button } from "@/components/ui/button";
import { Component, Cpu } from "lucide-react";

type GpuBrand = "nvidia" | "amd" | null;

interface GpuSelectorProps {
  gpuBrand: GpuBrand;
  onGpuBrandChange: (brand: GpuBrand) => void;
}

export function GpuSelector({ gpuBrand, onGpuBrandChange }: GpuSelectorProps) {
  const handleGpuBrandChange = (value: GpuBrand, e: React.MouseEvent) => {
    // Prevent the default button behavior which can cause page reloads
    e.preventDefault();
    onGpuBrandChange(gpuBrand === value ? null : value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
        <Component className="w-6 h-6" />
        Tarjeta Gráfica
      </h2>
      <div className="flex flex-col gap-4">
        <Button
          variant={gpuBrand === "nvidia" ? "filterSelected" : "filter"}
          size="filter"
          onClick={(e) => handleGpuBrandChange("nvidia", e)}
          aria-label="NVIDIA"
          title="NVIDIA"
          className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-green-900 hover:to-green-950"
        >
          <img
            src="/lovable-uploads/e5003a63-78de-4f15-a16f-033cbed63300.png"
            alt="NVIDIA"
            className="w-12 h-12 object-contain rounded"
          />
        </Button>
        <Button
          variant={gpuBrand === "amd" ? "filterSelected" : "filter"}
          size="filter"
          onClick={(e) => handleGpuBrandChange("amd", e)}
          aria-label="AMD"
          title="AMD"
          className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-red-900 hover:to-red-950"
        >
          <img
            src="/lovable-uploads/0d1ae45f-66d1-4e6f-b423-4217b0ac0685.png"
            alt="AMD"
            className="w-12 h-12 object-contain rounded"
          />
        </Button>
      </div>
    </div>
  );
}
