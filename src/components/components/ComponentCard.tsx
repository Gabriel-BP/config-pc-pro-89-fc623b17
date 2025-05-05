
import { Component } from "@/types/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressiveImage } from "../common/ProgressiveImage";

interface ComponentCardProps {
  component: Component;
  onClick: (component: Component) => void;
}

export function ComponentCard({ component, onClick }: ComponentCardProps) {
  return (
    <Card
      key={component._id}
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(component)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{component.Nombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProgressiveImage 
          url={component.URL} 
          alt={component.Nombre} 
        />
        <p className="text-gray-600 mb-2">Marca: {component.Marca}</p>
        {component.Precios.Nuevos && (
          <p className="text-xl font-bold text-blue-600">
            {component.Precios.Nuevos.Precio.valor} {component.Precios.Nuevos.Precio.moneda}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
