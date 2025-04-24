
import { useQuery } from "@tanstack/react-query";
import { getComponents } from "@/lib/axios";
import { Component, ComponentCategory } from "@/types/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentDetails } from "./ComponentDetails";
import { SortControls } from "./SortControls";
import { useState, useMemo } from "react";
import { getProxiedImageUrl } from "@/lib/imageUtils";

interface ComponentListProps {
  category: ComponentCategory;
  onSelectComponent: (component: Component) => void;
  filters?: any;
}

export function ComponentList({ category, onSelectComponent, filters }: ComponentListProps) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"nameAsc" | "nameDesc" | "priceAsc" | "priceDesc" | null>(null);

  const { data: components, isLoading } = useQuery({
    queryKey: ["components", category, filters],
    queryFn: () => getComponents(category, filters),
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

  const handleComponentClick = (component: Component) => {
    setSelectedComponent(component);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Cargando componentes...</p>
      </div>
    );
  }

  if (!components || components.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No se encontraron componentes con los filtros seleccionados</p>
      </div>
    );
  }

  return (
    <>
      <SortControls onSort={setSortOption} currentSort={sortOption} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {sortedComponents.map((component: Component) => (
          <Card
            key={component._id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleComponentClick(component)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{component.Nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Imagen del componente */}
              <img
                src={getProxiedImageUrl(component.URL)}
                alt={component.Nombre}
                className="h-32 w-full object-contain mb-4 rounded"
                loading="eager"
                crossOrigin="anonymous"
              />
              <p className="text-gray-600 mb-2">Marca: {component.Marca}</p>
              {component.Precios.Nuevos && (
                <p className="text-xl font-bold text-blue-600">
                  {component.Precios.Nuevos.Precio.valor}{" "}
                  {component.Precios.Nuevos.Precio.moneda}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <ComponentDetails
        component={selectedComponent}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAddComponent={onSelectComponent}
      />
    </>
  );
}
