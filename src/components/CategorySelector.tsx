
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentCategory } from "@/types/components";
import {
  Cpu,
  MonitorUp,
  HardDrive,
  Server,
  Power,
  Square,
  Fan,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategorySelectorProps {
  selectedCategory: ComponentCategory | null;
  onSelectCategory: (category: ComponentCategory) => void;
}

const categories = [
  { id: "cpu", name: "Procesador", icon: Cpu },
  { id: "gpu", name: "Tarjeta Gráfica", icon: MonitorUp },
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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2 text-white mb-6">
        Categorías
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        <TooltipProvider delayDuration={0}>
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <div 
                key={category.id} 
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div 
                  className={cn(
                    "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md bg-gray-800/90 text-white text-sm font-medium shadow-lg backdrop-blur-sm whitespace-nowrap z-50 transition-all duration-300 transform",
                    hoveredCategory === category.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                  )}
                >
                  {category.name}
                </div>
                
                <Button
                  variant={isSelected ? "filterSelected" : "filter"}
                  size="filter"
                  className={cn(
                    "flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900",
                    {
                      "hover:from-blue-900 hover:to-blue-950": category.id === "cpu" || category.id === "memory",
                      "hover:from-green-900 hover:to-green-950": category.id === "motherboard" || category.id === "storage",
                      "hover:from-red-900 hover:to-red-950": category.id === "gpu",
                      "hover:from-yellow-900 hover:to-yellow-950": category.id === "power-supply",
                      "hover:from-purple-900 hover:to-purple-950": category.id === "case" || category.id === "cooler",
                    }
                  )}
                  onClick={() => onSelectCategory(category.id as ComponentCategory)}
                  aria-label={category.name}
                  title={category.name}
                >
                  <Icon className="w-8 h-8" />
                </Button>
              </div>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
