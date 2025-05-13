
import { Button } from "@/components/ui/button";
import { Cpu } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type ProcessorBrand = "intel" | "amd" | null;
type SocketType = "am4" | "am5" | "lga1200" | "lga1700" | "lga1851" | null;

interface ProcessorSelectorProps {
  processorBrand: ProcessorBrand;
  socket: SocketType;
  onProcessorChange: (brand: ProcessorBrand) => void;
  onSocketChange: (socket: SocketType) => void;
}

export function ProcessorSelector({
  processorBrand,
  socket,
  onProcessorChange,
  onSocketChange,
}: ProcessorSelectorProps) {
  const handleProcessorBrandChange = (e: React.MouseEvent, value: ProcessorBrand) => {
    e.preventDefault(); // Evitar la recarga de la página
    onProcessorChange(processorBrand === value ? null : value);
  };

  const handleSocketChange = (value: SocketType) => {
    onSocketChange(socket === value ? null : value);
  };

  const getAMDSockets = () => ["am4", "am5"];
  const getIntelSockets = () => ["lga1200", "lga1700", "lga1851"];

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
          onClick={(e) => handleProcessorBrandChange(e, "intel")}
          aria-label="Intel"
          title="Intel"
          className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-blue-900 hover:to-blue-950"
        >
          <img
            src="/lovable-uploads/e5003a63-78de-4f15-a16f-033cbed63300.png"
            alt="Intel"
            className="w-12 h-12 object-contain rounded"
          />
        </Button>
        <Button
          variant={processorBrand === "amd" ? "filterSelected" : "filter"}
          size="filter"
          onClick={(e) => handleProcessorBrandChange(e, "amd")}
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
      
      {processorBrand === "intel" && (
        <div className="pt-4">
          <div className="text-white mb-2">Socket Intel:</div>
          <RadioGroup
            value={socket || ""}
            onValueChange={(value) => handleSocketChange(value as SocketType)}
            className="flex flex-col space-y-2"
          >
            {getIntelSockets().map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <RadioGroupItem value={s} id={s} className="text-blue-500" />
                <Label htmlFor={s} className="text-white">{s.toUpperCase()}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
      
      {processorBrand === "amd" && (
        <div className="pt-4">
          <div className="text-white mb-2">Socket AMD:</div>
          <RadioGroup
            value={socket || ""}
            onValueChange={(value) => handleSocketChange(value as SocketType)}
            className="flex flex-col space-y-2"
          >
            {getAMDSockets().map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <RadioGroupItem value={s} id={s} className="text-red-500" />
                <Label htmlFor={s} className="text-white">{s.toUpperCase()}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
