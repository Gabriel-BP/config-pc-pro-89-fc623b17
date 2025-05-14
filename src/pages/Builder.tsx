
import { useState, useEffect } from "react";
import { Component, ComponentCategory } from "@/types/components";
import { CategorySelector } from "@/components/CategorySelector";
import { ComponentList } from "@/components/ComponentList";
import { BuildSummary } from "@/components/BuildSummary";
import { Toaster } from "@/components/ui/sonner";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useFilters } from "@/context/FilterContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FilterPanel } from "@/components/filters/FilterPanel";

export default function Builder() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(
    null
  );
  const [componentFilters, setComponentFilters] = useState<Record<string, any>>({});
  
  // Get filters and selectedComponents from context
  const { filters, selectedComponents, setSelectedComponents } = useFilters();

  // Apply global filters when component category changes
  useEffect(() => {
    if (selectedCategory) {
      // Create a new filters object based on the currently selected category
      const newFilters: Record<string, any> = {};
      
      if (selectedCategory === "cpu") {
        // Apply processorBrand and socket filters for CPUs
        if (filters.processorBrand) {
          newFilters.processorBrand = filters.processorBrand;
        }
        if (filters.socket) {
          newFilters.socket = filters.socket;
        }
      } 
      else if (selectedCategory === "gpu") {
        // Apply gpuBrand filter for GPUs
        if (filters.gpuBrand) {
          newFilters.gpuBrand = filters.gpuBrand;
        }
      }
      else if (selectedCategory === "motherboard") {
        // Apply motherboardSize and socket filters for motherboards
        if (filters.motherboardSize) {
          newFilters.factor_de_forma = filters.motherboardSize;
        }
        if (filters.socket) {
          newFilters.socket = filters.socket;
        }
      }
      
      // Log the applied filters for debugging
      console.log(`Applying global filters for ${selectedCategory}:`, newFilters);
      
      // Set the component filters
      setComponentFilters(newFilters);
    }
  }, [selectedCategory, filters]);

  // Log current filters for debugging
  console.log('Current filters in Builder page:', filters);

  const handleSelectComponent = (component: Component) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [component.categoria]: component,
    }));
  };

  const handleRemoveComponent = (category: ComponentCategory) => {
    setSelectedComponents((prev) => {
      const newComponents = { ...prev };
      delete newComponents[category];
      return newComponents;
    });
  };

  const handleCategorySelect = (category: ComponentCategory) => {
    // If the category is already selected, deselect it
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      // Reset component-specific filters when changing categories
      setComponentFilters({});
    }
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    // Merge the global filters with component-specific filters
    const mergedFilters = { ...componentFilters };
    
    // Add any new filters from the FilterPanel
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] !== undefined && newFilters[key] !== "") {
        mergedFilters[key] = newFilters[key];
      }
    });
    
    console.log('Applied filters:', mergedFilters);
    setComponentFilters(mergedFilters);
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      <InteractiveBackground />
      <Toaster />
      
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Configurador de PC</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-8 animate-fade-in">
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
            
            {selectedCategory && (
              <div className="animate-fade-in relative">
                <Button 
                  variant="ghost"
                  size="icon" 
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700"
                  onClick={() => setSelectedCategory(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <ComponentList
                  category={selectedCategory}
                  onSelectComponent={handleSelectComponent}
                  filters={componentFilters}
                />
              </div>
            )}
          </div>
          <div className="space-y-8 animate-fade-in">
            <BuildSummary
              selectedComponents={selectedComponents}
              onRemoveComponent={handleRemoveComponent}
            />
            
            {/* Render FilterPanel below BuildSummary if a category is selected */}
            {selectedCategory && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-semibold text-white mb-3">Filtros de {getCategoryDisplayName(selectedCategory)}</h2>
                <FilterPanel 
                  category={selectedCategory}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper function to get display name for category
function getCategoryDisplayName(category: ComponentCategory): string {
  const categoryNames: Record<ComponentCategory, string> = {
    "case": "Gabinete",
    "cpu": "Procesador",
    "gpu": "Tarjeta Gráfica",
    "motherboard": "Placa Base",
    "power-supply": "Fuente de Alimentación",
    "memory": "Memoria RAM",
    "storage": "Almacenamiento",
    "cooler": "Refrigeración"
  };
  
  return categoryNames[category] || category;
}
