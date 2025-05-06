
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

  // Get the image src based on the selected brand
  const getBrandImage = () => {
    if (processorBrand === "intel") {
      return "/lovable-uploads/117c9ab0-96d1-4b66-a0a9-ac8af9ecdc52.png";
    } else if (processorBrand === "amd") {
      return "/lovable-uploads/0d1ae45f-66d1-4e6f-b423-4217b0ac0685.png";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
        <Cpu className="w-6 h-6" />
        Procesador
      </h2>
      <div className="flex justify-center gap-4">
        <Button
          variant={processorBrand === "intel" ? "filterSelected" : "filter"}
          size="filter"
          onClick={() => handleProcessorBrandChange("intel")}
          aria-label="Intel"
          title="Intel"
          className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-blue-900 hover:to-blue-950"
        >
          <img
            src="/lovable-uploads/117c9ab0-96d1-4b66-a0a9-ac8af9ecdc52.png"
            alt="Intel"
            className="w-12 h-12 object-contain rounded"
          />
        </Button>
        <Button
          variant={processorBrand === "amd" ? "filterSelected" : "filter"}
          size="filter"
          onClick={() => handleProcessorBrandChange("amd")}
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

      {processorBrand && (
        <div
          className={`space-y-4 transition-opacity duration-300 ease-in-out ${
            isSocketVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-xl font-medium text-white text-center">Socket</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {processorBrand === "amd" ? (
              <>
                <Button
                  variant={socket === "am4" ? "filterSelected" : "filter"}
                  size="filter"
                  className="animate-scale-in bg-gradient-to-b from-gray-800 to-gray-900 hover:from-red-900 hover:to-red-950 flex-col"
                  onClick={() => onSocketChange(socket === "am4" ? null : "am4")}
                  aria-label="AM4"
                  title="AM4"
                >
                  <img
                    src="/lovable-uploads/0d1ae45f-66d1-4e6f-b423-4217b0ac0685.png"
                    alt="AMD"
                    className="w-8 h-8 object-contain rounded mb-1"
                  />
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">AM4</span>
                </Button>
                <Button
                  variant={socket === "am5" ? "filterSelected" : "filter"}
                  size="filter"
                  className="animate-scale-in bg-gradient-to-b from-gray-800 to-gray-900 hover:from-red-900 hover:to-red-950 flex-col"
                  onClick={() => onSocketChange(socket === "am5" ? null : "am5")}
                  aria-label="AM5"
                  title="AM5"
                >
                  <img
                    src="/lovable-uploads/0d1ae45f-66d1-4e6f-b423-4217b0ac0685.png"
                    alt="AMD"
                    className="w-8 h-8 object-contain rounded mb-1"
                  />
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">AM5</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={socket === "lga1200" ? "filterSelected" : "filter"}
                  size="filter"
                  className="animate-scale-in bg-gradient-to-b from-gray-800 to-gray-900 hover:from-blue-900 hover:to-blue-950 flex-col"
                  onClick={() =>
                    onSocketChange(socket === "lga1200" ? null : "lga1200")
                  }
                  aria-label="LGA 1200"
                  title="LGA 1200"
                >
                  <img
                    src="/lovable-uploads/117c9ab0-96d1-4b66-a0a9-ac8af9ecdc52.png"
                    alt="Intel"
                    className="w-8 h-8 object-contain rounded mb-1"
                  />
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">LGA 1200</span>
                </Button>
                <Button
                  variant={socket === "lga1700" ? "filterSelected" : "filter"}
                  size="filter"
                  className="animate-scale-in bg-gradient-to-b from-gray-800 to-gray-900 hover:from-blue-900 hover:to-blue-950 flex-col"
                  onClick={() =>
                    onSocketChange(socket === "lga1700" ? null : "lga1700")
                  }
                  aria-label="LGA 1700"
                  title="LGA 1700"
                >
                  <img
                    src="/lovable-uploads/117c9ab0-96d1-4b66-a0a9-ac8af9ecdc52.png"
                    alt="Intel"
                    className="w-8 h-8 object-contain rounded mb-1"
                  />
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">LGA 1700</span>
                </Button>
                <Button
                  variant={socket === "lga1851" ? "filterSelected" : "filter"}
                  size="filter"
                  className="animate-scale-in bg-gradient-to-b from-gray-800 to-gray-900 hover:from-blue-900 hover:to-blue-950 flex-col"
                  onClick={() =>
                    onSocketChange(socket === "lga1851" ? null : "lga1851")
                  }
                  aria-label="LGA 1851"
                  title="LGA 1851"
                >
                  <img
                    src="/lovable-uploads/117c9ab0-96d1-4b66-a0a9-ac8af9ecdc52.png"
                    alt="Intel"
                    className="w-8 h-8 object-contain rounded mb-1"
                  />
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">LGA 1851</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
