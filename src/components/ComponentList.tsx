
import { useQuery } from "@tanstack/react-query";
import { getComponents } from "@/lib/axios";
import { Component, ComponentCategory } from "@/types/components";
import { ComponentDetails } from "./ComponentDetails";
import { SortControls } from "./SortControls";
import { useState, useMemo } from "react";
import { ComponentGrid } from "./components/ComponentGrid";
import { ComponentListPagination } from "./components/ComponentListPagination";

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

  // Add debugging to see what filters are being applied
  console.log('Component category:', category);
  console.log('Filters being sent to API:', filters);

  const { data: components, isLoading } = useQuery({
    queryKey: ["components", category, filters],
    queryFn: () => getComponents(category, filters),
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

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Cargando componentes...</p>
      </div>
    );
  }

  return (
    <>
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
