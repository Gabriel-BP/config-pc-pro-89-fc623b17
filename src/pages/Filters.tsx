
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Cpu, Square } from "lucide-react";

type ProcessorBrand = "intel" | "amd" | null;
type SocketType = "am4" | "am5" | "lga1200" | "lga1700" | "lga1851" | null;
type GpuBrand = "nvidia" | "amd" | null;
type MotherboardSize = "atx" | "micro-atx" | "mini-itx" | null;

export default function Filters() {
  const navigate = useNavigate();
  const [processorBrand, setProcessorBrand] = useState<ProcessorBrand>(null);
  const [socket, setSocket] = useState<SocketType>(null);
  const [gpuBrand, setGpuBrand] = useState<GpuBrand>(null);
  const [motherboardSize, setMotherboardSize] = useState<MotherboardSize>(null);

  const handleProcessorBrandChange = (value: ProcessorBrand) => {
    setProcessorBrand(value);
    setSocket(null); // Reset socket when brand changes
  };

  const canContinue = processorBrand && socket && gpuBrand && motherboardSize;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-8">Configura tus preferencias</h1>

        <div className="space-y-8">
          {/* Procesador */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Cpu className="w-6 h-6" />
              Procesador
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <RadioGroup
                className="grid grid-cols-2 gap-4"
                value={processorBrand || ""}
                onValueChange={(value) => handleProcessorBrandChange(value as ProcessorBrand)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intel" id="intel" />
                  <label htmlFor="intel">Intel</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amd" id="amd" />
                  <label htmlFor="amd">AMD</label>
                </div>
              </RadioGroup>
            </div>

            {processorBrand && (
              <div className="pl-6 space-y-4 animate-fade-in">
                <h3 className="text-xl font-medium">Socket</h3>
                <RadioGroup
                  className="grid grid-cols-2 gap-4"
                  value={socket || ""}
                  onValueChange={(value) => setSocket(value as SocketType)}
                >
                  {processorBrand === "amd" ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="am4" id="am4" />
                        <label htmlFor="am4">AM4</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="am5" id="am5" />
                        <label htmlFor="am5">AM5</label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lga1200" id="lga1200" />
                        <label htmlFor="lga1200">LGA 1200</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lga1700" id="lga1700" />
                        <label htmlFor="lga1700">LGA 1700</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lga1851" id="lga1851" />
                        <label htmlFor="lga1851">LGA 1851</label>
                      </div>
                    </>
                  )}
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Tarjeta Gráfica */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Tarjeta Gráfica</h2>
            <RadioGroup
              className="grid grid-cols-2 gap-4 max-w-md"
              value={gpuBrand || ""}
              onValueChange={(value) => setGpuBrand(value as GpuBrand)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nvidia" id="nvidia" />
                <label htmlFor="nvidia">NVIDIA</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amd" id="amd-gpu" />
                <label htmlFor="amd-gpu">AMD</label>
              </div>
            </RadioGroup>
          </div>

          {/* Tamaño de Placa Base */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Square className="w-6 h-6" />
              Tamaño de Placa Base
            </h2>
            <RadioGroup
              className="grid grid-cols-3 gap-4 max-w-xl"
              value={motherboardSize || ""}
              onValueChange={(value) => setMotherboardSize(value as MotherboardSize)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="atx" id="atx" />
                <label htmlFor="atx">ATX</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="micro-atx" id="micro-atx" />
                <label htmlFor="micro-atx">Micro-ATX</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mini-itx" id="mini-itx" />
                <label htmlFor="mini-itx">Mini-ITX</label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button
          onClick={() => navigate("/builder")}
          disabled={!canContinue}
          size="lg"
          className="mt-8 animate-scale-in"
        >
          Continuar a la configuración
        </Button>
      </div>
    </div>
  );
}
