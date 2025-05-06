
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Component, ComponentCategory } from "@/types/components";

type ProcessorBrand = "intel" | "amd" | null;
type SocketType = "am4" | "am5" | "lga1200" | "lga1700" | "lga1851" | null;
type GpuBrand = "nvidia" | "amd" | null;
type MotherboardSize = "atx" | "micro-atx" | "mini-itx" | null;

interface FilterState {
  processorBrand: ProcessorBrand;
  socket: SocketType;
  gpuBrand: GpuBrand;
  motherboardSize: MotherboardSize;
}

interface FilterContextProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedComponents: Partial<Record<ComponentCategory, Component>>;
  setSelectedComponents: React.Dispatch<React.SetStateAction<Partial<Record<ComponentCategory, Component>>>>;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const defaultFilters: FilterState = {
  processorBrand: null,
  socket: null,
  gpuBrand: null,
  motherboardSize: null,
};

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedComponents, setSelectedComponents] = useState<Partial<Record<ComponentCategory, Component>>>({});

  return (
    <FilterContext.Provider value={{ filters, setFilters, selectedComponents, setSelectedComponents }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextProps => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
