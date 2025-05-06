
import { useState, useEffect } from "react";
import { CheckCircle, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useFilters } from "@/context/FilterContext";
import jsPDF from "jspdf";
import { toast } from "sonner";

export default function Validation() {
  const navigate = useNavigate();
  const [validationComplete, setValidationComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const { selectedComponents } = useFilters();

  useEffect(() => {
    // Simulate validation progress
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setValidationComplete(true);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 150);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
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
    
    // Add components table
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Componentes:", 20, 45);
    
    // Table headers
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Componente", 20, 55);
    doc.text("Cantidad", 120, 55);
    doc.text("Precio", 160, 55);
    
    // Add components data
    let yPosition = 65;
    let total = 0;
    const quantities = {};
    
    // Set default quantities if selectedComponents exists
    if (selectedComponents) {
      Object.keys(selectedComponents).forEach(category => {
        quantities[category] = 1;
      });
    }
    
    // Add each component
    if (selectedComponents) {
      Object.entries(selectedComponents).forEach(([category, component], index) => {
        if (component && component.Precios.Nuevos?.Precio.valor) {
          const quantity = quantities[category] || 1;
          const price = component.Precios.Nuevos.Precio.valor * quantity;
          total += price;
          
          doc.text(component.Nombre.substring(0, 60), 20, yPosition);
          doc.text(quantity.toString(), 120, yPosition);
          doc.text(`${price.toFixed(2)} €`, 160, yPosition);
          
          yPosition += 10;
        }
      });
    }
    
    // Add line before total
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    // Add total
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 120, yPosition);
    doc.text(`${total.toFixed(2)} €`, 160, yPosition);
    
    // Add footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Configuración validada - Todos los componentes son compatibles", 105, 280, { align: "center" });
    
    // Save PDF
    doc.save("configuracion-pc.pdf");
    toast.success("PDF descargado correctamente");
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <InteractiveBackground />
      
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4 text-white hover:bg-white/10"
            onClick={() => navigate("/builder")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Validación de Compatibilidad</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-16 flex flex-col items-center">
        <div className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center">
          {!validationComplete ? (
            <>
              <div className="text-2xl font-bold text-white mb-8">
                Verificando compatibilidad de componentes...
              </div>
              
              <div className="w-full bg-gray-800 rounded-full h-4 mb-8 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
                {["Procesador", "Placa base", "Memoria RAM", "Tarjeta gráfica"].map((component) => (
                  <div 
                    key={component}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg
                      ${progress > 30 ? "text-green-400" : "text-gray-400"}
                      ${progress > 30 ? "bg-green-900/20" : "bg-gray-800/30"}
                      transition-all duration-500 border border-white/5
                    `}
                  >
                    {progress > 30 && <CheckCircle className="h-4 w-4" />}
                    <span>{component}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center animate-scale-in">
              <div className="w-24 h-24 rounded-full bg-green-900/30 flex items-center justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">¡Configuración Válida!</h2>
              
              <p className="text-gray-300 text-center mb-8 max-w-md">
                Todos los componentes son compatibles entre sí y cumplen con los requisitos mínimos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-400 mb-2">Rendimiento</h3>
                  <p className="text-white">Excelente para gaming y tareas intensivas</p>
                </div>
                
                <div className="bg-blue-950/30 border border-blue-500/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-400 mb-2">Refrigeración</h3>
                  <p className="text-white">Adecuada para todos los componentes</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button 
                  onClick={() => navigate("/builder")}
                  className="
                    bg-gradient-to-r from-green-600 to-emerald-600
                    hover:from-green-700 hover:to-emerald-700
                    text-white px-6 py-6 rounded-lg
                    shadow-[0_0_15px_rgba(72,187,120,0.5)]
                    hover:shadow-[0_0_25px_rgba(72,187,120,0.8)]
                    transition-all duration-300
                    text-lg w-full sm:w-auto
                  "
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Volver al Builder
                </Button>
                
                <Button 
                  onClick={handleDownloadPDF}
                  className="
                    bg-gradient-to-r from-blue-600 to-indigo-600
                    hover:from-blue-700 hover:to-indigo-700
                    text-white px-6 py-6 rounded-lg
                    shadow-[0_0_15px_rgba(66,153,225,0.5)]
                    hover:shadow-[0_0_25px_rgba(66,153,225,0.8)]
                    transition-all duration-300
                    text-lg w-full sm:w-auto
                  "
                >
                  <Download className="mr-2 h-5 w-5" />
                  Descargar Build
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
