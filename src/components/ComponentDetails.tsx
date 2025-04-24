
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, ImageOff, Image } from "lucide-react";
import { Component } from "@/types/components";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const [imageError, setImageError] = useState(false);
  
  if (!component) return null;

  const handleAddComponent = () => {
    onAddComponent(component);
    onClose();
  };

  const handleImageError = () => {
    console.log("Error loading image:", component.URL);
    setImageError(true);
  };

  // Use placeholder based on component category
  const getPlaceholder = () => {
    const category = component.categoria;
    // Different placeholder for each category
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{component.Nombre}</DialogTitle>
          <DialogDescription>
            Detalles del componente y especificaciones
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {imageError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Imagen no disponible</AlertTitle>
              <AlertDescription>
                No se ha podido cargar la imagen de este componente.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Imagen y precio */}
            <div className="md:w-1/2">
              {imageError ? (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center flex-col">
                  <Image className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Usando imagen de placeholder</p>
                  <img 
                    src={getPlaceholder()} 
                    alt="Placeholder" 
                    className="w-full h-auto rounded-lg object-cover mt-2"
                    loading="eager"
                  />
                </div>
              ) : (
                <img
                  src={component.URL || getPlaceholder()}
                  alt={component.Nombre}
                  className="w-full h-auto rounded-lg object-cover"
                  onError={handleImageError}
                  loading="eager"
                />
              )}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Precios</h3>
                {component.Precios.Nuevos && (
                  <div className="flex justify-between items-center">
                    <span>Nuevo:</span>
                    <span className="text-xl font-bold text-primary">
                      {component.Precios.Nuevos.Precio.valor} {component.Precios.Nuevos.Precio.moneda}
                    </span>
                  </div>
                )}
                {component.Precios.Utilizados && (
                  <div className="flex justify-between items-center mt-2">
                    <span>Usado:</span>
                    <span className="text-lg text-muted-foreground">
                      {component.Precios.Utilizados.Precio.valor} {component.Precios.Utilizados.Precio.moneda}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Características */}
            <div className="md:w-1/2">
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
