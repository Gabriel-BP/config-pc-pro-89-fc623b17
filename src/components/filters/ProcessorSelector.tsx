
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cpu } from "lucide-react";

type ProcessorBrand = "intel" | "amd" | null;
type SocketType = "am4" | "am5" | "lga1200" | "lga1700" | "lga1851" | null;

interface ProcessorSelectorProps {
  processorBrand: ProcessorBrand;
  socket: SocketType;
  onProcessorChange: (brand: ProcessorBrand) => void;
  onSocketChange: (socket: SocketType) => void;
}

export default function ProcessorSelector({
  processorBrand,
  socket,
  onProcessorChange,
  onSocketChange,
}: ProcessorSelectorProps) {
  const [isSocketVisible, setIsSocketVisible] = useState(false);

  const handleProcessorBrandChange = (value: ProcessorBrand) => {
    if (value === processorBrand) {
      setIsSocketVisible(false);
      setTimeout(() => {
        onProcessorChange(null);
        onSocketChange(null);
      }, 300);
    } else {
      if (processorBrand) {
        setIsSocketVisible(false);
        setTimeout(() => {
          onProcessorChange(value);
          onSocketChange(null);
          setIsSocketVisible(true);
        }, 300);
      } else {
        onProcessorChange(value);
        onSocketChange(null);
        setIsSocketVisible(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
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
            src="/lovable-uploads/117c9ab0-96d1-4b66-a0a9-ac8af9ecdc52.png"
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
            src="/lovable-uploads/e5003a63-78de-4f15-a16f-033cbed63300.png"
            alt="AMD"
            className="w-12 h-12 object-cover rounded"
          />
          <span>AMD</span>
        </Button>
      </div>

      {processorBrand && (
        <div
          className={`pl-6 space-y-4 transition-opacity duration-300 ease-in-out ${
            isSocketVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-xl font-medium text-white">Socket</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {processorBrand === "amd" ? (
              <>
                <Button
                  variant="outline"
                  className={`animate-scale-in h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                    socket === "am4"
                      ? "bg-blue-900/50 border-blue-500 text-blue-300"
                      : "hover:bg-gray-800/50"
                  }`}
                  onClick={() => onSocketChange(socket === "am4" ? null : "am4")}
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
                  className={`animate-scale-in h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                    socket === "am5"
                      ? "bg-blue-900/50 border-blue-500 text-blue-300"
                      : "hover:bg-gray-800/50"
                  }`}
                  onClick={() => onSocketChange(socket === "am5" ? null : "am5")}
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
                  className={`animate-scale-in h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                    socket === "lga1200"
                      ? "bg-blue-900/50 border-blue-500 text-blue-300"
                      : "hover:bg-gray-800/50"
                  }`}
                  onClick={() =>
                    onSocketChange(socket === "lga1200" ? null : "lga1200")
                  }
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
                  className={`animate-scale-in h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                    socket === "lga1700"
                      ? "bg-blue-900/50 border-blue-500 text-blue-300"
                      : "hover:bg-gray-800/50"
                  }`}
                  onClick={() =>
                    onSocketChange(socket === "lga1700" ? null : "lga1700")
                  }
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
                  className={`animate-scale-in h-24 flex flex-col items-center justify-center gap-2 transition-all ${
                    socket === "lga1851"
                      ? "bg-blue-900/50 border-blue-500 text-blue-300"
                      : "hover:bg-gray-800/50"
                  }`}
                  onClick={() =>
                    onSocketChange(socket === "lga1851" ? null : "lga1851")
                  }
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
  );
}
