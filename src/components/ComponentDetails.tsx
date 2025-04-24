
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { Component } from "@/types/components";
import { getProxiedImageUrl } from "@/lib/imageUtils";
import { useProgressiveImage } from '@/hooks/useProgressiveImage';
import { Skeleton } from "@/components/ui/skeleton";

interface ComponentDetailsProps {
  component: Component | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComponent: (component: Component) => void;
}

// Create the ProgressiveImage component here
const ProgressiveImage = ({ url, alt }: { url: string; alt: string }) => {
  const { loadedUrl, isLoading, error } = useProgressiveImage(url);
  
  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }
  
  if (error) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
          <p>No se pudo cargar la imagen</p>
        </div>
      </div>
    );
  }
  
  return (
    <img
      src={loadedUrl}
      alt={alt}
      className="w-full h-auto rounded-lg object-cover"
      loading="eager"
      crossOrigin="anonymous"
    />
  );
};

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
          <div className="flex flex-col md:flex-row gap-6">
            {/* Imagen y precio */}
            <div className="md:w-1/2">
              <ProgressiveImage 
                url={component.URL} 
                alt={component.Nombre}
              />
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
