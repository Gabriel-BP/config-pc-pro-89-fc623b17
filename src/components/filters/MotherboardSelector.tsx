
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

type MotherboardSize = "ATX" | "Micro-ATX" | "Mini-ITX" | null;

interface MotherboardSelectorProps {
  motherboardSize: MotherboardSize;
  onMotherboardSizeChange: (size: MotherboardSize) => void;
}

export default function MotherboardSelector({
  motherboardSize,
  onMotherboardSizeChange,
}: MotherboardSelectorProps) {
  const handleMotherboardSizeChange = (e: React.MouseEvent, value: MotherboardSize) => {
    e.preventDefault(); // Evitar recarga de página
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
          variant={motherboardSize === "ATX" ? "filterSelected" : "filter"}
          size="filter"
          onClick={(e) => handleMotherboardSizeChange(e, "ATX")}
          aria-label="ATX"
          title="ATX"
          className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-purple-900 hover:to-purple-950 flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-white to-gray-300 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]" style={{
              textShadow: "0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.2)"
            }}>ATX</span>
          </div>
        </Button>
        <Button
          variant={motherboardSize === "Micro-ATX" ? "filterSelected" : "filter"}
          size="filter"
          onClick={(e) => handleMotherboardSizeChange(e, "Micro-ATX")}
          aria-label="Micro-ATX"
          title="Micro-ATX"
          className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-purple-900 hover:to-purple-950 flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-white to-gray-300 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]" style={{
              textShadow: "0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.2)"
            }}>MICRO-ATX</span>
          </div>
        </Button>
        <Button
          variant={motherboardSize === "Mini-ITX" ? "filterSelected" : "filter"}
          size="filter"
          onClick={(e) => handleMotherboardSizeChange(e, "Mini-ITX")}
          aria-label="Mini-ITX"
          title="Mini-ITX"
          className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-purple-900 hover:to-purple-950 flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-white to-gray-300 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]" style={{
              textShadow: "0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.2)"
            }}>MINI-ITX</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
