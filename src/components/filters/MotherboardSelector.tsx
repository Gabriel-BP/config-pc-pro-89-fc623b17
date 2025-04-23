
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

type MotherboardSize = "atx" | "micro-atx" | "mini-itx" | null;

interface MotherboardSelectorProps {
  motherboardSize: MotherboardSize;
  onMotherboardSizeChange: (size: MotherboardSize) => void;
}

export default function MotherboardSelector({
  motherboardSize,
  onMotherboardSizeChange,
}: MotherboardSelectorProps) {
  const handleMotherboardSizeChange = (value: MotherboardSize) => {
    onMotherboardSizeChange(motherboardSize === value ? null : value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
        <Square className="w-6 h-6" />
        Tamaño de Placa Base
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className={`h-24 flex flex-col items-center justify-center gap-2 transition-all bg-gray-900/50 border-gray-800 ${
            motherboardSize === "atx"
              ? "bg-blue-900/50 border-blue-500 text-blue-300"
              : "hover:bg-gray-800/70"
          }`}
          onClick={() => handleMotherboardSizeChange("atx")}
        >
          <img
            src="/placeholder.svg"
            alt="ATX"
            className="w-12 h-12 object-contain rounded"
          />
          <span>ATX</span>
        </Button>
        <Button
          variant="outline"
          className={`h-24 flex flex-col items-center justify-center gap-2 transition-all bg-gray-900/50 border-gray-800 ${
            motherboardSize === "micro-atx"
              ? "bg-blue-900/50 border-blue-500 text-blue-300"
              : "hover:bg-gray-800/70"
          }`}
          onClick={() => handleMotherboardSizeChange("micro-atx")}
        >
          <img
            src="/placeholder.svg"
            alt="Micro-ATX"
            className="w-12 h-12 object-contain rounded"
          />
          <span>Micro-ATX</span>
        </Button>
        <Button
          variant="outline"
          className={`h-24 flex flex-col items-center justify-center gap-2 transition-all bg-gray-900/50 border-gray-800 ${
            motherboardSize === "mini-itx"
              ? "bg-blue-900/50 border-blue-500 text-blue-300"
              : "hover:bg-gray-800/70"
          }`}
          onClick={() => handleMotherboardSizeChange("mini-itx")}
        >
          <img
            src="/placeholder.svg"
            alt="Mini-ITX"
            className="w-12 h-12 object-contain rounded"
          />
          <span>Mini-ITX</span>
        </Button>
      </div>
    </div>
  );
}
