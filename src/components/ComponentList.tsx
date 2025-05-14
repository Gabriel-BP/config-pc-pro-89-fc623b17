
import { useQuery } from "@tanstack/react-query";
import { getComponents } from "@/lib/axios";
import { Component, ComponentCategory } from "@/types/components";
import { ComponentDetails } from "./ComponentDetails";
import { SortControls } from "./SortControls";
import { useState, useMemo, useEffect } from "react";
import { ComponentGrid } from "./components/ComponentGrid";
import { ComponentListPagination } from "./components/ComponentListPagination";
import { toast } from "sonner";

interface ComponentListProps {
  category: ComponentCategory;
  onSelectComponent: (component: Component) => void;
  filters?: Record<string, any>;
}

export function ComponentList({ category, onSelectComponent, filters = {} }: ComponentListProps) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"nameAsc" | "nameDesc" | "priceAsc" | "priceDesc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;
  const [lastUsedFilters, setLastUsedFilters] = useState<Record<string, any>>({});

  // Reset pagination when category or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, JSON.stringify(filters)]);

  // Process filters before sending to API
  const processedFilters = useMemo(() => {
    const result: Record<string, any> = {};
    
    // Copy filters and normalize them
    Object.entries(filters).forEach(([key, value]) => {
      // Skip empty values
      if (value === undefined || value === null || value === "") {
        return;
      }
      
      // Special handling for filter transformations based on your backend expectations
      if (key === "name") {
        result.name = value;
      } 
      // Handle CPU specific filters
      else if (category === "cpu") {
        if (key === "processorBrand") {
          result.processorBrand = value;
        } 
        else if (key === "socket" || key === "enchufe") {
          // Make sure we're sending socket in the expected format for the backend
          result.enchufe = value;
        }
        else if (key === "nucleos" && Array.isArray(value) && value[0] === value[1]) {
          // If min and max are the same for nucleos, send as single value
          result.nucleos = value[0];
        }
        else {
          // Pass through other filters
          result[key] = value;
        }
      }
      // Handle GPU specific filters
      else if (category === "gpu") {
        if (key === "gpuBrand") {
          result.gpuBrand = value;
        }
        else if (key === "memoria" && Array.isArray(value) && value[0] === value[1]) {
          // If min and max are the same for memoria, send as single value
          result.memoria = value[0];
        }
        else {
          // Pass through other filters
          result[key] = value;
        }
      }
      // Handle motherboard specific filters
      else if (category === "motherboard") {
        if (key === "motherboardSize" || key === "factor_de_forma") {
          // Normalize motherboard size to the expected format
          result.factor_de_forma = value;
        }
        else if (key === "socket" || key === "enchufe") {
          // Make sure we're sending socket in the expected format for the backend
          result.enchufe = value;
        }
        else if (key === "ranuras_de_ram" && Array.isArray(value) && value[0] === value[1]) {
          // If min and max are the same for ranuras_de_ram, send as single value
          result.ranuras_de_ram = value[0];
        }
        else {
          // Pass through other filters
          result[key] = value;
        }
      } 
      else {
        // For other categories, handle arrays with same min/max values
        if (Array.isArray(value) && value.length === 2 && value[0] === value[1]) {
          result[key] = value[0];
        } else {
          result[key] = value;
        }
      }
    });
    
    return result;
  }, [filters, category]);

  // Add debugging to see what filters are being applied
  console.log('Component category:', category);
  console.log('Processed filters being sent to API:', processedFilters);

  const { data: components, isLoading, isError, error } = useQuery({
    queryKey: ["components", category, processedFilters],
    queryFn: () => getComponents(category, processedFilters),
    meta: {
      onSuccess: (data: Component[]) => {
        // Check if filters changed and results came back
        const filtersChanged = JSON.stringify(lastUsedFilters) !== JSON.stringify(processedFilters);
        setLastUsedFilters(processedFilters);
        
        // Show toast if filters were applied and results changed
        if (filtersChanged && Object.keys(processedFilters).length > 0) {
          toast.success(`Se encontraron ${data.length} componentes`);
        }
      },
      onError: (err: Error) => {
        console.error('Error fetching components:', err);
        toast.error('Error al cargar los componentes');
      }
    }
  });

  // Add debugging for received components
  useEffect(() => {
    console.log(`Received ${components?.length || 0} components for category ${category}`);
    if (components?.length === 0 && Object.keys(processedFilters).length > 0) {
      // Log a sample filter to see what query would work
      console.log('No components found with these filters. Consider relaxing filter criteria.');
    }
  }, [components, category, processedFilters]);
  
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

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Cargando componentes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error al cargar los componentes: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <>
      <SortControls onSort={setSortOption} currentSort={sortOption} />
      
      {components && components.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No se encontraron componentes con los filtros seleccionados</p>
        </div>
      ) : (
        <>
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
        </>
      )}

      <ComponentDetails
        component={selectedComponent}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAddComponent={onSelectComponent}
      />
    </>
  );
}
