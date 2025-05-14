import { Component } from "@/types/components";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { convertToEuros, formatEuroPrice } from "@/lib/currencyUtils";

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
  const navigate = useNavigate();
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
      const priceInEuros = convertToEuros(
        component.Precios.Nuevos.Precio.valor, 
        component.Precios.Nuevos.Precio.moneda
      );
      return acc + (priceInEuros * (quantities[category] || 1));
    }
    return acc;
  }, 0);

  // Helper function to format component prices in euros
  const getComponentPrice = (component: Component, quantity: number) => {
    if (component?.Precios.Nuevos?.Precio.valor) {
      const priceInEuros = convertToEuros(
        component.Precios.Nuevos.Precio.valor,
        component.Precios.Nuevos.Precio.moneda
      );
      return formatEuroPrice(priceInEuros * quantity);
    }
    return "-";
  };

  const handleValidate = async () => {
    navigate("/validation");
    const componentesNombres = Object.values(selectedComponents).map(c => c?.Nombre).filter(Boolean);
    console.log("Componentes seleccionados para validar:", componentesNombres);

    try {
      const response = await fetch('http://localhost:3000/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentes: componentesNombres })
      });

      const data = await response.json();
      console.log("Resultado validación Neo4j:", data.result);
    } catch (error) {
      console.error("❌ Error llamando a /api/validate:", error);
    }
  };

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
                  {component ? getComponentPrice(component, quantities[category] || 1) : "-"}
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
                {formatEuroPrice(total)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleValidate}
            className="
              bg-gradient-to-r from-blue-600 to-purple-600
              hover:from-blue-700 hover:to-purple-700
              text-white px-6 py-2 rounded-lg
              shadow-[0_0_15px_rgba(66,153,225,0.5)]
              hover:shadow-[0_0_25px_rgba(66,153,225,0.8)]
              transition-all duration-300
            "
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Validar
          </Button>
        </div>
      </div>
    </div>
  );
}
