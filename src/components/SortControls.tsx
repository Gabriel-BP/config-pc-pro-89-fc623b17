
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowDownAZ, ArrowUpAZ, ArrowDownZA, ArrowUpZA } from "lucide-react";

type SortOption = "nameAsc" | "nameDesc" | "priceAsc" | "priceDesc";

interface SortControlsProps {
  onSort: (option: SortOption) => void;
  currentSort: SortOption | null;
}

export function SortControls({ onSort, currentSort }: SortControlsProps) {
  return (
    <div className="flex gap-2 p-4 justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={currentSort === "nameAsc" ? "default" : "outline"}
            size="icon"
            onClick={() => onSort("nameAsc")}
          >
            <ArrowDownAZ className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ordenar por nombre: A-Z</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={currentSort === "nameDesc" ? "default" : "outline"}
            size="icon"
            onClick={() => onSort("nameDesc")}
          >
            <ArrowUpZA className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ordenar por nombre: Z-A</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={currentSort === "priceAsc" ? "default" : "outline"}
            size="icon"
            onClick={() => onSort("priceAsc")}
          >
            <ArrowUpAZ className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ordenar por precio: Menor a mayor</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={currentSort === "priceDesc" ? "default" : "outline"}
            size="icon"
            onClick={() => onSort("priceDesc")}
          >
            <ArrowDownZA className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ordenar por precio: Mayor a menor</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
