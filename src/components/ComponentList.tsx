
import { useQuery } from "@tanstack/react-query";
import { getComponents } from "@/lib/axios";
import { Component, ComponentCategory } from "@/types/components";
import { ComponentDetails } from "./ComponentDetails";
import { SortControls } from "./SortControls";
import { useState, useMemo } from "react";
import { ComponentGrid } from "./components/ComponentGrid";
import { ComponentListPagination } from "./components/ComponentListPagination";
import { FilterPanel } from "./filters/FilterPanel";

interface ComponentListProps {
  category: ComponentCategory;
  onSelectComponent: (component: Component) => void;
  filters?: Record<string, any>;
}

export function ComponentList({ category, onSelectComponent, filters: contextFilters = {} }: ComponentListProps) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"nameAsc" | "nameDesc" | "priceAsc" | "priceDesc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [componentFilters, setComponentFilters] = useState<Record<string, any>>({});
  const itemsPerPage = 14;

  // Map the filters to the backend expected format if needed
  const mappedContextFilters = useMemo(() => {
    const result: Record<string, any> = {};
    
    // Map motherboardSize to a format the backend understands
    if (contextFilters.motherboardSize) {
      result.motherboardSize = contextFilters.motherboardSize;
    }

    // Add the other filters directly
    if (contextFilters.processorBrand) {
      result.processorBrand = contextFilters.processorBrand;
    }
    
    if (contextFilters.socket) {
      result.socket = contextFilters.socket;
    }
    
    if (contextFilters.gpuBrand) {
      result.gpuBrand = contextFilters.gpuBrand;
    }

    return result;
  }, [contextFilters]);

  // Combine context filters with component-specific filters
  const combinedFilters = useMemo(() => {
    return { ...mappedContextFilters, ...componentFilters };
  }, [mappedContextFilters, componentFilters]);

  // Add debugging to see what filters are being applied
  console.log('Component category:', category);
  console.log('Context filters:', contextFilters);
  console.log('Combined filters being sent to API:', combinedFilters);

  const { data: components, isLoading } = useQuery({
    queryKey: ["components", category, combinedFilters],
    queryFn: () => getComponents(category, combinedFilters),
  });

  const sortedComponents = useMemo(() => {
    if (!components) return [];
    
    if (!sortOption) return components;
    
    const componentsCopy = [...components];
    
    switch (sortOption) {
      case "nameAsc":
        return componentsCopy.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
      case "nameDesc":
        return componentsCopy.sort((a, b) => b.Nombre.localeCompare(a.Nombre));
      case "priceAsc":
        return componentsCopy.sort((a, b) => {
          const priceA = a.Precios.Nuevos?.Precio.valor || 0;
          const priceB = b.Precios.Nuevos?.Precio.valor || 0;
          return priceA - priceB;
        });
      case "priceDesc":
        return componentsCopy.sort((a, b) => {
          const priceA = a.Precios.Nuevos?.Precio.valor || 0;
          const priceB = b.Precios.Nuevos?.Precio.valor || 0;
          return priceB - priceA;
        });
      default:
        return componentsCopy;
    }
  }, [components, sortOption]);

  const paginatedComponents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedComponents.slice(startIndex, endIndex);
  }, [sortedComponents, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil((sortedComponents?.length || 0) / itemsPerPage);
  }, [sortedComponents]);

  const handleComponentClick = (component: Component) => {
    setSelectedComponent(component);
    setIsDetailsOpen(true);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setComponentFilters(newFilters);
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Cargando componentes...</p>
      </div>
    );
  }

  return (
    <>
      <FilterPanel category={category} onFilterChange={handleFilterChange} />
      
      <SortControls onSort={setSortOption} currentSort={sortOption} />
      
      <ComponentGrid 
        components={paginatedComponents} 
        onComponentClick={handleComponentClick} 
      />

      <ComponentListPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />

      <ComponentDetails
        component={selectedComponent}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAddComponent={onSelectComponent}
      />
    </>
  );
}
