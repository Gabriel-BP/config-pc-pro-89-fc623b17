import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentCategory } from "@/types/components";
import {
  Cpu,
  Graphics,
  HardDrive,
  MonitorUp,
  Server,
  Power,
  Square,
  Fan,
} from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: ComponentCategory | null;
  onSelectCategory: (category: ComponentCategory) => void;
}

const categories = [
  { id: "cpu", name: "Procesador", icon: Cpu },
  { id: "graphics", name: "Tarjeta Gráfica", icon: Graphics },
  { id: "motherboard", name: "Placa Base", icon: Server },
  { id: "memory", name: "Memoria RAM", icon: MonitorUp },
  { id: "storage", name: "Almacenamiento", icon: HardDrive },
  { id: "power-supply", name: "Fuente", icon: Power },
  { id: "case", name: "Gabinete", icon: Square },
  { id: "cooler", name: "Refrigeración", icon: Fan },
] as const;

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Button
            key={category.id}
            variant="outline"
            className={cn(
              "h-24 flex flex-col items-center justify-center gap-2 transition-all",
              selectedCategory === category.id &&
                "bg-blue-50 border-blue-500 text-blue-700"
            )}
            onClick={() => onSelectCategory(category.id as ComponentCategory)}
          >
            <Icon className="w-6 h-6" />
            <span className="text-sm font-medium">{category.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
