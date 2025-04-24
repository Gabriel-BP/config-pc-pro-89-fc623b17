
import { useQuery } from "@tanstack/react-query";
import { getComponents } from "@/lib/axios";
import { Component, ComponentCategory } from "@/types/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentDetails } from "./ComponentDetails";
import { SortControls } from "./SortControls";
import { useState, useMemo } from "react";
import { ImageOff, Image } from "lucide-react";

interface ComponentListProps {
  category: ComponentCategory;
  onSelectComponent: (component: Component) => void;
  filters?: any;
}

export function ComponentList({ category, onSelectComponent, filters }: ComponentListProps) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"nameAsc" | "nameDesc" | "priceAsc" | "priceDesc" | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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

  const handleImageError = (componentId: string) => {
    console.log("Error loading thumbnail image:", componentId);
    setImageErrors(prev => ({
      ...prev,
      [componentId]: true
    }));
  };
  
  // Get category-specific placeholder images
  const getPlaceholder = (category: string) => {
    switch (category) {
      case "cpu":
        return "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=60";
      case "gpu":
        return "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60";
      case "motherboard":
        return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60";
      default:
        return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=60";
    }
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
              {/* Thumbnail image */}
              {imageErrors[component._id] ? (
                <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center flex-col">
                  <Image className="h-8 w-8 text-gray-400 mb-1" />
                  <p className="text-sm text-gray-500 mb-1">Usando placeholder</p>
                  <img 
                    src={getPlaceholder(component.categoria)} 
                    alt="Placeholder" 
                    className="h-20 w-full object-contain"
                    loading="eager"
                  />
                </div>
              ) : (
                <img
                  src={component.URL || getPlaceholder(component.categoria)}
                  alt={component.Nombre}
                  className="h-32 w-full object-contain mb-4 rounded"
                  onError={() => handleImageError(component._id)}
                  loading="eager"
                />
              )}
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
