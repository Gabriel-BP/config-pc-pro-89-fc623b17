
import jsPDF from "jspdf";
import { Component } from "@/types/components";
import { convertToEuros } from "@/lib/currencyUtils";

interface ComponentMap {
  [key: string]: Component;
}

export const generateConfigPDF = (selectedComponents: ComponentMap) => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Add title
  doc.setFontSize(22);
  doc.setTextColor(33, 33, 33);
  doc.text("Configuración de PC", 105, 20, { align: "center" });
  
  // Add date
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  const date = new Date().toLocaleDateString("es-ES");
  doc.text(`Fecha: ${date}`, 105, 30, { align: "center" });
  
  // Add line
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Add components table header
  doc.setFontSize(14);
  doc.setTextColor(33, 33, 33);
  doc.text("Componentes:", 20, 45);
  
  // Table headers
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text("Componente", 20, 55);
  doc.text("Cantidad", 140, 55);
  doc.text("Precio", 170, 55);
  
  // Add components data
  let yPosition = 65;
  let total = 0;
  
  // Process components for PDF
  if (selectedComponents) {
    Object.entries(selectedComponents).forEach(([category, component]) => {
      if (component && component.Precios.Nuevos?.Precio.valor) {
        // Calculate price in euros
        const originalValue = component.Precios.Nuevos.Precio.valor;
        const originalCurrency = component.Precios.Nuevos.Precio.moneda;
        const priceInEuros = convertToEuros(originalValue, originalCurrency);
        const quantity = 1;
        total += priceInEuros;
        
        // Truncate component name if too long
        let displayName = component.Nombre;
        if (displayName.length > 50) {
          displayName = displayName.substring(0, 47) + "...";
        }
        
        // Only add if there's room on the page, otherwise create a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20; // Reset position for new page
          
          // Add header for continuation
          doc.setFontSize(11);
          doc.setTextColor(80, 80, 80);
          doc.text("Componente", 20, yPosition);
          doc.text("Cantidad", 140, yPosition);
          doc.text("Precio", 170, yPosition);
          yPosition += 10;
        }
        
        doc.setFontSize(10);
        doc.setTextColor(33, 33, 33);
        doc.text(displayName, 20, yPosition);
        doc.text(quantity.toString(), 145, yPosition);
        doc.text(`${priceInEuros.toFixed(2)} €`, 170, yPosition);
        
        yPosition += 10;
      }
    });
  }
  
  // Add line before total
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  
  // Add total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", 140, yPosition);
  doc.text(`${total.toFixed(2)} €`, 170, yPosition);
  
  // Add footer
  const lastPage = doc.internal.pages.length - 1;
  doc.setPage(lastPage);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Configuración validada - Todos los componentes son compatibles", 105, 280, { align: "center" });
  
  // Save PDF
  doc.save("configuracion-pc.pdf");
  return true;
};
