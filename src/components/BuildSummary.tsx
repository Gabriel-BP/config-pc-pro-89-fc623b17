
import { Component } from "@/types/components";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface ComponentQuantity {
  component: Component;
  quantity: number;
}

interface BuildSummaryProps {
  selectedComponents: Partial<Record<string, Component>>;
  onRemoveComponent: (category: string) => void;
}

export function BuildSummary({
  selectedComponents,
  onRemoveComponent,
}: BuildSummaryProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    Object.keys(selectedComponents).forEach(category => {
      initial[category] = 1;
    });
    return initial;
  });

  const handleQuantityChange = (category: string, delta: number) => {
    setQuantities(prev => {
      const newQuantity = Math.max(1, (prev[category] || 1) + delta);
      return { ...prev, [category]: newQuantity };
    });
  };

  const total = Object.entries(selectedComponents).reduce((acc, [category, component]) => {
    if (component?.Precios.Nuevos?.Precio.valor) {
      return acc + (component.Precios.Nuevos.Precio.valor * (quantities[category] || 1));
    }
    return acc;
  }, 0);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-4">Resumen del Build</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Componente</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(selectedComponents).map(([category, component]) => (
              <TableRow key={category}>
                <TableCell className="font-medium">{category}</TableCell>
                <TableCell>{component?.Nombre || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(category, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{quantities[category] || 1}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(category, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {component?.Precios.Nuevos?.Precio.valor ? 
                    `${(component.Precios.Nuevos.Precio.valor * (quantities[category] || 1)).toFixed(2)} ${component.Precios.Nuevos.Precio.moneda}` 
                    : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemoveComponent(category)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="font-bold">
                Total
              </TableCell>
              <TableCell className="text-right font-bold">
                {total.toFixed(2)} €
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
