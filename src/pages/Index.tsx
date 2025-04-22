
import { useState } from "react";
import { Component, ComponentCategory } from "@/types/components";
import { CategorySelector } from "@/components/CategorySelector";
import { ComponentList } from "@/components/ComponentList";
import { BuildSummary } from "@/components/BuildSummary";
import { Toaster } from "@/components/ui/sonner";

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(
    null
  );
  const [selectedComponents, setSelectedComponents] = useState<
    Partial<Record<ComponentCategory, Component>>
  >({});

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
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Configurador de PC</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-8">
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            {selectedCategory && (
              <ComponentList
                category={selectedCategory}
                onSelectComponent={handleSelectComponent}
              />
            )}
          </div>
          <div>
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
