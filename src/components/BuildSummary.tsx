
import { Component } from "@/types/components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BuildSummaryProps {
  selectedComponents: Partial<Record<string, Component>>;
  onRemoveComponent: (category: string) => void;
}

export function BuildSummary({
  selectedComponents,
  onRemoveComponent,
}: BuildSummaryProps) {
  const total = Object.values(selectedComponents).reduce((acc, component) => {
    if (component?.Precios.Nuevos?.Precio.valor) {
      return acc + component.Precios.Nuevos.Precio.valor;
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
              <TableHead className="text-right">Precio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(selectedComponents).map(([category, component]) => (
              <TableRow key={category}>
                <TableCell className="font-medium">{category}</TableCell>
                <TableCell>{component?.Nombre || "-"}</TableCell>
                <TableCell className="text-right">
                  {component?.Precios.Nuevos?.Precio.valor || "-"}{" "}
                  {component?.Precios.Nuevos?.Precio.moneda}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} className="font-bold">
                Total
              </TableCell>
              <TableCell className="text-right font-bold">
                {total.toFixed(2)} €
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
