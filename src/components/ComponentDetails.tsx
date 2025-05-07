
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Component } from "@/types/components";
import { ProgressiveImage } from "./common/ProgressiveImage";
import { convertToEuros, formatEuroPrice } from "@/lib/currencyUtils";

interface ComponentDetailsProps {
  component: Component | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComponent: (component: Component) => void;
}

export function ComponentDetails({ 
  component, 
  isOpen, 
  onClose,
  onAddComponent 
}: ComponentDetailsProps) {
  
  if (!component) return null;

  const handleAddComponent = () => {
    onAddComponent(component);
    onClose();
  };

  // Convert prices to euros
  const formatPrice = (priceInfo: any) => {
    if (!priceInfo) return null;
    const priceInEuros = convertToEuros(priceInfo.Precio.valor, priceInfo.Precio.moneda);
    return formatEuroPrice(priceInEuros);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{component.Nombre}</DialogTitle>
          <DialogDescription>
            Detalles del componente y especificaciones
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Imagen y precio */}
            <div className="md:w-1/2">
              <ProgressiveImage 
                url={component.Imagen || component.URL} 
                alt={component.Nombre}
                className="h-64 w-full"
                objectFit="cover"
              />
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Precios</h3>
                {component.Precios.Nuevos && (
                  <div className="flex justify-between items-center">
                    <span>Nuevo:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(component.Precios.Nuevos)}
                    </span>
                  </div>
                )}
                {component.Precios.Utilizados && (
                  <div className="flex justify-between items-center mt-2">
                    <span>Usado:</span>
                    <span className="text-lg text-muted-foreground">
                      {formatPrice(component.Precios.Utilizados)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Características */}
            <div className="md:w-1/2">
              {component.Descripción && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                  <p className="text-sm text-muted-foreground">{component.Descripción}</p>
                </div>
              )}
              
              <h3 className="text-lg font-semibold mb-3">Características</h3>
              <div className="space-y-2">
                {Object.entries(component.Características).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2 odd:bg-muted/50 rounded">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleAddComponent}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2" />
            Añadir a la build
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
