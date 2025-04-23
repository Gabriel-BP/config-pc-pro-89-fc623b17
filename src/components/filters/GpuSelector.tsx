
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
            gpuBrand === "nvidia"
              ? "bg-blue-900/50 border-blue-500 text-blue-300"
              : "hover:bg-gray-800/50"
          }`}
          onClick={() => handleGpuBrandChange("nvidia")}
        >
          <img
            src="/lovable-uploads/eb7c955a-2b19-4c80-8db4-46cd7f425fc0.png"
            alt="NVIDIA"
            className="w-12 h-12 object-contain rounded"
          />
          <span>NVIDIA</span>
        </Button>
        <Button
          variant="outline"
          className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
            gpuBrand === "amd"
              ? "bg-blue-900/50 border-blue-500 text-blue-300"
              : "hover:bg-gray-800/50"
          }`}
          onClick={() => handleGpuBrandChange("amd")}
        >
          <img
            src="/lovable-uploads/0d1ae45f-66d1-4e6f-b423-4217b0ac0685.png"
            alt="AMD"
            className="w-12 h-12 object-contain rounded"
          />
          <span>AMD</span>
        </Button>
      </div>
    </div>
  );
}
