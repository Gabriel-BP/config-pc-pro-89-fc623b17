
import { useState } from "react";
import { Component, ComponentCategory } from "@/types/components";
import { CategorySelector } from "@/components/CategorySelector";
import { ComponentList } from "@/components/ComponentList";
import { BuildSummary } from "@/components/BuildSummary";
import { Toaster } from "@/components/ui/sonner";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useFilters } from "@/context/FilterContext";

export default function Builder() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(
    null
  );
  const [selectedComponents, setSelectedComponents] = useState<
    Partial<Record<ComponentCategory, Component>>
  >({});
  
  // Get filters from context
  const { filters } = useFilters();

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
              onSelectCategory={setSelectedCategory}
            />
            {selectedCategory && (
              <div className="animate-fade-in">
                <ComponentList
                  category={selectedCategory}
                  onSelectComponent={handleSelectComponent}
                  filters={filters}
                />
              </div>
            )}
          </div>
          <div className="animate-fade-in">
            <BuildSummary
              selectedComponents={selectedComponents}
              onRemoveComponent={handleRemoveComponent}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
