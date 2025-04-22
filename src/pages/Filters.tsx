
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, MonitorUp, Square } from "lucide-react";

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
    setSocket(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Configura tus preferencias
        </h1>

        <div className="space-y-12">
          {/* Procesador */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Cpu className="w-6 h-6" />
              Procesador
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                  processorBrand === "intel"
                    ? "bg-blue-900/50 border-blue-500 text-blue-300"
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => handleProcessorBrandChange("intel")}
              >
                <img
                  src="/placeholder.svg"
                  alt="Intel"
                  className="w-12 h-12 object-cover rounded"
                />
                <span>Intel</span>
              </Button>
              <Button
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                  processorBrand === "amd"
                    ? "bg-blue-900/50 border-blue-500 text-blue-300"
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => handleProcessorBrandChange("amd")}
              >
                <img
                  src="/placeholder.svg"
                  alt="AMD"
                  className="w-12 h-12 object-cover rounded"
                />
                <span>AMD</span>
              </Button>
            </div>

            {processorBrand && (
              <div className="pl-6 space-y-4 animate-fade-in">
                <h3 className="text-xl font-medium">Socket</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {processorBrand === "amd" ? (
                    <>
                      <Button
                        variant="outline"
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                          socket === "am4"
                            ? "bg-blue-900/50 border-blue-500 text-blue-300"
                            : "hover:bg-gray-800/50"
                        }`}
                        onClick={() => setSocket("am4")}
                      >
                        <img
                          src="/placeholder.svg"
                          alt="AM4"
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span>AM4</span>
                      </Button>
                      <Button
                        variant="outline"
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                          socket === "am5"
                            ? "bg-blue-900/50 border-blue-500 text-blue-300"
                            : "hover:bg-gray-800/50"
                        }`}
                        onClick={() => setSocket("am5")}
                      >
                        <img
                          src="/placeholder.svg"
                          alt="AM5"
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span>AM5</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                          socket === "lga1200"
                            ? "bg-blue-900/50 border-blue-500 text-blue-300"
                            : "hover:bg-gray-800/50"
                        }`}
                        onClick={() => setSocket("lga1200")}
                      >
                        <img
                          src="/placeholder.svg"
                          alt="LGA 1200"
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span>LGA 1200</span>
                      </Button>
                      <Button
                        variant="outline"
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                          socket === "lga1700"
                            ? "bg-blue-900/50 border-blue-500 text-blue-300"
                            : "hover:bg-gray-800/50"
                        }`}
                        onClick={() => setSocket("lga1700")}
                      >
                        <img
                          src="/placeholder.svg"
                          alt="LGA 1700"
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span>LGA 1700</span>
                      </Button>
                      <Button
                        variant="outline"
                        className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                          socket === "lga1851"
                            ? "bg-blue-900/50 border-blue-500 text-blue-300"
                            : "hover:bg-gray-800/50"
                        }`}
                        onClick={() => setSocket("lga1851")}
                      >
                        <img
                          src="/placeholder.svg"
                          alt="LGA 1851"
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span>LGA 1851</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta Gráfica */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
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
                onClick={() => setGpuBrand("nvidia")}
              >
                <img
                  src="/placeholder.svg"
                  alt="NVIDIA"
                  className="w-12 h-12 object-cover rounded"
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
                onClick={() => setGpuBrand("amd")}
              >
                <img
                  src="/placeholder.svg"
                  alt="AMD"
                  className="w-12 h-12 object-cover rounded"
                />
                <span>AMD</span>
              </Button>
            </div>
          </div>

          {/* Tamaño de Placa Base */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Square className="w-6 h-6" />
              Tamaño de Placa Base
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                  motherboardSize === "atx"
                    ? "bg-blue-900/50 border-blue-500 text-blue-300"
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => setMotherboardSize("atx")}
              >
                <img
                  src="/placeholder.svg"
                  alt="ATX"
                  className="w-12 h-12 object-cover rounded"
                />
                <span>ATX</span>
              </Button>
              <Button
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                  motherboardSize === "micro-atx"
                    ? "bg-blue-900/50 border-blue-500 text-blue-300"
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => setMotherboardSize("micro-atx")}
              >
                <img
                  src="/placeholder.svg"
                  alt="Micro-ATX"
                  className="w-12 h-12 object-cover rounded"
                />
                <span>Micro-ATX</span>
              </Button>
              <Button
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                  motherboardSize === "mini-itx"
                    ? "bg-blue-900/50 border-blue-500 text-blue-300"
                    : "hover:bg-gray-800/50"
                }`}
                onClick={() => setMotherboardSize("mini-itx")}
              >
                <img
                  src="/placeholder.svg"
                  alt="Mini-ITX"
                  className="w-12 h-12 object-cover rounded"
                />
                <span>Mini-ITX</span>
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate("/builder")}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 animate-scale-in"
        >
          Continuar a la configuración
        </Button>
      </div>
    </div>
  );
}
