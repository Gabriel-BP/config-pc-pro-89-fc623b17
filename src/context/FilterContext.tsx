
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Component, ComponentCategory } from "@/types/components";

type ProcessorBrand = "intel" | "amd" | null;
type SocketType = "am4" | "am5" | "lga1200" | "lga1700" | "lga1851" | null;
type GpuBrand = "nvidia" | "amd" | null;
type MotherboardSize = "ATX" | "Micro-ATX" | "Mini-ITX" | null;

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

  // Log filters whenever they change
  useEffect(() => {
    console.log('Current filters in context:', filters);
  }, [filters]);

  // Update filters based on selected components
  useEffect(() => {
    // Extract socket from CPU or motherboard if it exists and update filters
    const cpu = selectedComponents.cpu;
    const motherboard = selectedComponents.motherboard;
    
    if (cpu?.Características?.Enchufe) {
      const socketString = cpu.Características.Enchufe;
      // Extract socket type from string like "AM4" or "LGA1700"
      let socketType: SocketType = null;
      
      if (socketString.includes("AM4")) socketType = "am4";
      else if (socketString.includes("AM5")) socketType = "am5";
      else if (socketString.includes("LGA1200")) socketType = "lga1200";
      else if (socketString.includes("LGA1700")) socketType = "lga1700";
      else if (socketString.includes("LGA1851")) socketType = "lga1851";
      
      // Update socket in filters if we detected a valid one
      if (socketType && socketType !== filters.socket) {
        console.log(`Setting socket to ${socketType} based on selected CPU`);
        setFilters(prev => ({...prev, socket: socketType}));
      }
    } 
    else if (motherboard?.Características?.Enchufe) {
      const socketString = motherboard.Características.Enchufe;
      // Extract socket type from string
      let socketType: SocketType = null;
      
      if (socketString.includes("AM4")) socketType = "am4";
      else if (socketString.includes("AM5")) socketType = "am5";
      else if (socketString.includes("LGA1200")) socketType = "lga1200";
      else if (socketString.includes("LGA1700")) socketType = "lga1700";
      else if (socketString.includes("LGA1851")) socketType = "lga1851";
      
      // Update socket in filters if we detected a valid one
      if (socketType && socketType !== filters.socket) {
        console.log(`Setting socket to ${socketType} based on selected motherboard`);
        setFilters(prev => ({...prev, socket: socketType}));
      }
    }
  }, [selectedComponents, filters.socket]);

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
