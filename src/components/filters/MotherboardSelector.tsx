
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
      <div className="flex justify-center gap-4">
        <Button
          variant={motherboardSize === "atx" ? "filterSelected" : "filter"}
          size="filter"
          onClick={() => handleMotherboardSizeChange("atx")}
          aria-label="ATX"
          title="ATX"
          className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border-gray-700 hover:from-purple-900 hover:to-purple-950"
        >
          <img
            src="/placeholder.svg"
            alt="ATX"
            className="w-12 h-12 object-contain rounded"
          />
        </Button>
        <Button
          variant={motherboardSize === "micro-atx" ? "filterSelected" : "filter"}
          size="filter"
          onClick={() => handleMotherboardSizeChange("micro-atx")}
          aria-label="Micro-ATX"
          title="Micro-ATX"
          className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border-gray-700 hover:from-purple-900 hover:to-purple-950"
        >
          <img
            src="/placeholder.svg"
            alt="Micro-ATX"
            className="w-12 h-12 object-contain rounded"
          />
        </Button>
        <Button
          variant={motherboardSize === "mini-itx" ? "filterSelected" : "filter"}
          size="filter"
          onClick={() => handleMotherboardSizeChange("mini-itx")}
          aria-label="Mini-ITX"
          title="Mini-ITX"
          className="bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border-gray-700 hover:from-purple-900 hover:to-purple-950"
        >
          <img
            src="/placeholder.svg"
            alt="Mini-ITX"
            className="w-12 h-12 object-contain rounded"
          />
        </Button>
      </div>
    </div>
  );
}
