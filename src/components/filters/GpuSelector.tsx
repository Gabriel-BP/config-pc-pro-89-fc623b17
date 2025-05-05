
import { Button } from "@/components/ui/button";
import { MonitorUp } from "lucide-react";

type GpuBrand = "nvidia" | "amd" | null;

interface GpuSelectorProps {
  gpuBrand: GpuBrand;
  onGpuChange: (brand: GpuBrand) => void;
}

export default function GpuSelector({ gpuBrand, onGpuChange }: GpuSelectorProps) {
  const handleGpuBrandChange = (value: GpuBrand) => {
    onGpuChange(gpuBrand === value ? null : value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
        <MonitorUp className="w-6 h-6" />
        Tarjeta Gráfica
      </h2>
      <div className="flex justify-center gap-4">
        <Button
          variant={gpuBrand === "nvidia" ? "filterSelected" : "filter"}
          size="filter"
          onClick={() => handleGpuBrandChange("nvidia")}
          aria-label="NVIDIA"
          title="NVIDIA"
          className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-green-900 hover:to-green-950"
        >
          <img
            src="/lovable-uploads/eb7c955a-2b19-4c80-8db4-46cd7f425fc0.png"
            alt="NVIDIA"
            className="w-12 h-12 object-contain rounded"
          />
        </Button>
        <Button
          variant={gpuBrand === "amd" ? "filterSelected" : "filter"}
          size="filter"
          onClick={() => handleGpuBrandChange("amd")}
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
