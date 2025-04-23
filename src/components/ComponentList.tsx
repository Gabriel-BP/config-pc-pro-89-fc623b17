
import { useQuery } from "@tanstack/react-query";
import { getComponents } from "@/lib/axios";
import { Component, ComponentCategory } from "@/types/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComponentListProps {
  category: ComponentCategory;
  onSelectComponent: (component: Component) => void;
  filters?: any;
}

export function ComponentList({ category, onSelectComponent, filters }: ComponentListProps) {
  const { data: components, isLoading } = useQuery({
    queryKey: ["components", category, filters],
    queryFn: () => getComponents(category, filters),
  });

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {components?.map((component: Component) => (
        <Card
          key={component._id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelectComponent(component)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{component.Nombre}</CardTitle>
          </CardHeader>
          <CardContent>
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
  );
}
