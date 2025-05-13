
import { ComponentCategory } from "@/types/components";
import { useEffect, useState } from "react";
import ProcessorSelector from "./ProcessorSelector";
import GpuSelector from "./GpuSelector";
import MotherboardSelector from "./MotherboardSelector";

interface FilterPanelProps {
  category: ComponentCategory;
  onFilterChange: (filters: Record<string, any>) => void;
  className?: string;
}

export function FilterPanel({ category, onFilterChange, className = "" }: FilterPanelProps) {
  const [processorBrand, setProcessorBrand] = useState<"intel" | "amd" | null>(null);
  const [socket, setSocket] = useState<"am4" | "am5" | "lga1200" | "lga1700" | "lga1851" | null>(null);
  const [gpuBrand, setGpuBrand] = useState<"nvidia" | "amd" | null>(null);
  const [motherboardSize, setMotherboardSize] = useState<"ATX" | "Micro-ATX" | "Mini-ITX" | null>(null);

  useEffect(() => {
    // Create a filters object based on the selected filters
    const filters: Record<string, any> = {};

    if (processorBrand) {
      filters.processorBrand = processorBrand;
    }

    if (socket) {
      filters.socket = socket;
    }

    if (gpuBrand) {
      filters.gpuBrand = gpuBrand;
    }

    if (motherboardSize) {
      filters.motherboardSize = motherboardSize;
    }

    // Send the filters to the parent component
    onFilterChange(filters);
  }, [processorBrand, socket, gpuBrand, motherboardSize, onFilterChange]);

  // Handle the click to prevent the default form submission behavior
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className={className} onClick={handleButtonClick}>
      {category === "processor" && (
        <ProcessorSelector
          processorBrand={processorBrand}
          socket={socket}
          onProcessorChange={setProcessorBrand}
          onSocketChange={setSocket}
        />
      )}

      {category === "graphic-card" && (
        <GpuSelector
          gpuBrand={gpuBrand}
          onGpuBrandChange={setGpuBrand}
        />
      )}

      {category === "motherboard" && (
        <MotherboardSelector
          motherboardSize={motherboardSize}
          onMotherboardSizeChange={setMotherboardSize}
        />
      )}
    </div>
  );
}
