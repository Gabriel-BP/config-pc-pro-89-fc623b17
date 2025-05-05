
import { Component } from "@/types/components";
import { ComponentCard } from "./ComponentCard";

interface ComponentGridProps {
  components: Component[];
  onComponentClick: (component: Component) => void;
}

export function ComponentGrid({ components, onComponentClick }: ComponentGridProps) {
  if (!components || components.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No se encontraron componentes con los filtros seleccionados</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {components.map((component: Component) => (
        <ComponentCard
          key={component._id}
          component={component}
          onClick={onComponentClick}
        />
      ))}
    </div>
  );
}
