
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
  showFiltersSidebar?: boolean;
}

export function ComponentList({ 
  category, 
  onSelectComponent, 
  filters: contextFilters = {},
  showFiltersSidebar = false 
}: ComponentListProps) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"nameAsc" | "nameDesc" | "priceAsc" | "priceDesc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [componentFilters, setComponentFilters] = useState<Record<string, any>>({});
  const itemsPerPage = 14;

  // Map the filters to the backend expected format with exact values needed by MongoDB
  const mappedContextFilters = useMemo(() => {
    console.log('Mapping context filters for category:', category, contextFilters);
    const result: Record<string, any> = {};
    
    // Map motherboardSize to the exact format stored in the database
    if (contextFilters.motherboardSize) {
      result.motherboardSize = contextFilters.motherboardSize;
      console.log(`Set motherboardSize filter to: ${result.motherboardSize}`);
    }

    // Add processor brand filter
    if (contextFilters.processorBrand) {
      result.processorBrand = contextFilters.processorBrand;
      console.log(`Set processorBrand filter to: ${result.processorBrand}`);
    }
    
    // Add socket filter - send as-is and let the server handle the formatting
    if (contextFilters.socket) {
      result.socket = contextFilters.socket;
      console.log(`Set socket filter to: ${result.socket}`);
    }
    
    // Add GPU brand filter (NVIDIA, AMD)
    if (contextFilters.gpuBrand) {
      result.gpuBrand = contextFilters.gpuBrand;
      console.log(`Set gpuBrand filter to: ${result.gpuBrand}`);
    }

    return result;
  }, [contextFilters, category]);

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

  // Add debugging for received components
  console.log(`Received ${components?.length || 0} components for category ${category}`);
  if (components?.length === 0) {
    // Log a sample filter to see what query would work
    console.log('No components found with these filters.');
  }
  
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
    // Prevent form submission/page reload
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
    <div className={`${showFiltersSidebar ? "flex flex-col md:flex-row gap-6" : ""}`}>
      <div className={`${showFiltersSidebar ? "flex-1" : ""}`}>
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
      </div>
      
      {showFiltersSidebar && (
        <div className="w-full md:w-64 shrink-0 mt-6 md:mt-0">
          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
            <FilterPanel 
              category={category} 
              onFilterChange={handleFilterChange} 
              className="flex flex-col space-y-6"
            />
          </div>
        </div>
      )}

      <ComponentDetails
        component={selectedComponent}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAddComponent={onSelectComponent}
      />
    </div>
  );
}
