
import { Component } from "@/types/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressiveImage } from "../common/ProgressiveImage";
import { convertToEuros, formatEuroPrice } from "@/lib/currencyUtils";

interface ComponentCardProps {
  component: Component;
  onClick: (component: Component) => void;
}

export function ComponentCard({ component, onClick }: ComponentCardProps) {
  // Process price to ensure it's displayed in euros
  const renderPrice = () => {
    if (component.Precios.Nuevos) {
      const originalValue = component.Precios.Nuevos.Precio.valor;
      const originalCurrency = component.Precios.Nuevos.Precio.moneda;
      const priceInEuros = convertToEuros(originalValue, originalCurrency);
      
      return (
        <p className="text-xl font-bold text-blue-600">
          {formatEuroPrice(priceInEuros)}
        </p>
      );
    }
    return null;
  };

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
          url={component.Imagen || component.URL} 
          alt={component.Nombre} 
        />
        <p className="text-gray-600 mb-2">{component.Marca}</p>
        {renderPrice()}
      </CardContent>
    </Card>
  );
}
