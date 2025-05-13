
import { useState } from "react";
import { ComponentCategory } from "@/types/components";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterPanelProps {
  category: ComponentCategory;
  onFilterChange: (filters: Record<string, any>) => void;
}

export function FilterPanel({ category, onFilterChange }: FilterPanelProps) {
  const [nameFilter, setNameFilter] = useState("");
  const [openFilters, setOpenFilters] = useState(true);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameFilter(value);
    onFilterChange({ ...filters, name: value });
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setNameFilter("");
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-white/10 backdrop-blur-sm p-4 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre..."
            value={nameFilter}
            onChange={handleNameChange}
            className="pl-10 bg-black/30 border-white/10 text-white"
          />
        </div>
        <Collapsible open={openFilters} onOpenChange={setOpenFilters}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md bg-black/30 hover:bg-black/50 border border-white/10">
              <Filter className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {renderCategoryFilters(category, filters, handleFilterChange)}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="bg-black/30 border-white/10 hover:bg-black/50 text-white"
              >
                Restablecer filtros
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

function renderCategoryFilters(
  category: ComponentCategory,
  filters: Record<string, any>,
  handleFilterChange: (key: string, value: any) => void
) {
  switch (category) {
    case "case":
      return (
        <>
          <FilterCheckbox
            id="factor_de_forma_atx"
            label="ATX"
            checked={filters.factor_de_forma_atx}
            onChange={(checked) => handleFilterChange("factor_de_forma_atx", checked)}
          />
          <FilterCheckbox
            id="factor_de_forma_micro_atx"
            label="Micro-ATX"
            checked={filters.factor_de_forma_micro_atx}
            onChange={(checked) => handleFilterChange("factor_de_forma_micro_atx", checked)}
          />
          <FilterCheckbox
            id="factor_de_forma_mini_itx"
            label="Mini-ITX"
            checked={filters.factor_de_forma_mini_itx}
            onChange={(checked) => handleFilterChange("factor_de_forma_mini_itx", checked)}
          />
          <FilterSlider
            id="longitud_maxima_de_gpu"
            label="Longitud máx. GPU (mm)"
            value={filters.longitud_maxima_de_gpu || [0, 500]}
            onChange={(value) => handleFilterChange("longitud_maxima_de_gpu", value)}
            min={0}
            max={500}
            step={10}
          />
          <FilterSelect
            id="ranuras_de_expansion"
            label="Ranuras de expansión"
            value={filters.ranuras_de_expansion || ""}
            onChange={(value) => handleFilterChange("ranuras_de_expansion", value)}
            options={[
              { value: "7", label: "7" },
              { value: "8", label: "8" },
              { value: "9", label: "9" },
            ]}
          />
        </>
      );
    case "cooler":
      return (
        <>
          <FilterCheckbox
            id="refrigerado_por_agua"
            label="Refrigeración líquida"
            checked={filters.refrigerado_por_agua}
            onChange={(checked) => handleFilterChange("refrigerado_por_agua", checked)}
          />
          <FilterCheckbox
            id="sin_ventilador"
            label="Pasivo (sin ventilador)"
            checked={filters.sin_ventilador}
            onChange={(checked) => handleFilterChange("sin_ventilador", checked)}
          />
          <FilterSlider
            id="ruido_maximo"
            label="Ruido máximo (dB)"
            value={filters.ruido_maximo || [0, 50]}
            onChange={(value) => handleFilterChange("ruido_maximo", value)}
            min={0}
            max={50}
            step={1}
          />
          <FilterSlider
            id="rpm_maximas"
            label="RPM máximas"
            value={filters.rpm_maximas || [0, 2500]}
            onChange={(value) => handleFilterChange("rpm_maximas", value)}
            min={0}
            max={2500}
            step={100}
          />
          <FilterSlider
            id="longitud_del_radiador"
            label="Longitud del radiador (mm)"
            value={filters.longitud_del_radiador || [0, 360]}
            onChange={(value) => handleFilterChange("longitud_del_radiador", value)}
            min={0}
            max={360}
            step={30}
          />
        </>
      );
    case "gpu":
      return (
        <>
          <FilterSlider
            id="memoria"
            label="Memoria VRAM (GB)"
            value={filters.memoria || [0, 24]}
            onChange={(value) => handleFilterChange("memoria", value)}
            min={0}
            max={24}
            step={2}
          />
          <FilterSelect
            id="tipo_de_memoria"
            label="Tipo de memoria"
            value={filters.tipo_de_memoria || ""}
            onChange={(value) => handleFilterChange("tipo_de_memoria", value)}
            options={[
              { value: "GDDR6", label: "GDDR6" },
              { value: "GDDR6X", label: "GDDR6X" },
              { value: "HBM2", label: "HBM2" },
            ]}
          />
          <FilterSlider
            id="tdp"
            label="Consumo TDP (W)"
            value={filters.tdp || [0, 500]}
            onChange={(value) => handleFilterChange("tdp", value)}
            min={0}
            max={500}
            step={25}
          />
          <FilterSlider
            id="longitud"
            label="Longitud (mm)"
            value={filters.longitud || [0, 400]}
            onChange={(value) => handleFilterChange("longitud", value)}
            min={0}
            max={400}
            step={10}
          />
          <FilterSelect
            id="interfaz"
            label="Interfaz"
            value={filters.interfaz || ""}
            onChange={(value) => handleFilterChange("interfaz", value)}
            options={[
              { value: "PCIe 3.0 x16", label: "PCIe 3.0 x16" },
              { value: "PCIe 4.0 x16", label: "PCIe 4.0 x16" },
              { value: "PCIe 5.0 x16", label: "PCIe 5.0 x16" },
            ]}
          />
        </>
      );
    case "memory":
      return (
        <>
          <FilterSelect
            id="tipo_de_memoria"
            label="Tipo de memoria"
            value={filters.tipo_de_memoria || ""}
            onChange={(value) => handleFilterChange("tipo_de_memoria", value)}
            options={[
              { value: "DDR4", label: "DDR4" },
              { value: "DDR5", label: "DDR5" },
            ]}
          />
          <FilterSlider
            id="velocidad"
            label="Velocidad (MHz)"
            value={filters.velocidad || [2000, 6000]}
            onChange={(value) => handleFilterChange("velocidad", value)}
            min={2000}
            max={6000}
            step={200}
          />
          <FilterSelect
            id="configuracion"
            label="Configuración"
            value={filters.configuracion || ""}
            onChange={(value) => handleFilterChange("configuracion", value)}
            options={[
              { value: "2x8GB", label: "2x8GB" },
              { value: "2x16GB", label: "2x16GB" },
              { value: "2x32GB", label: "2x32GB" },
              { value: "4x8GB", label: "4x8GB" },
              { value: "4x16GB", label: "4x16GB" },
            ]}
          />
          <FilterCheckbox
            id="refrigeracion_pasiva"
            label="Refrigeración pasiva"
            checked={filters.refrigeracion_pasiva}
            onChange={(checked) => handleFilterChange("refrigeracion_pasiva", checked)}
          />
          <FilterSlider
            id="latencia_cas"
            label="Latencia CAS"
            value={filters.latencia_cas || [1, 40]}
            onChange={(value) => handleFilterChange("latencia_cas", value)}
            min={1}
            max={40}
            step={1}
          />
        </>
      );
    case "motherboard":
      return (
        <>
          <FilterSelect
            id="factor_de_forma"
            label="Factor de forma"
            value={filters.factor_de_forma || ""}
            onChange={(value) => handleFilterChange("factor_de_forma", value)}
            options={[
              { value: "ATX", label: "ATX" },
              { value: "Micro-ATX", label: "Micro-ATX" },
              { value: "Mini-ITX", label: "Mini-ITX" },
            ]}
          />
          <FilterSelect
            id="enchufe"
            label="Socket"
            value={filters.enchufe || ""}
            onChange={(value) => handleFilterChange("enchufe", value)}
            options={[
              { value: "AM4", label: "AM4" },
              { value: "AM5", label: "AM5" },
              { value: "LGA1200", label: "LGA1200" },
              { value: "LGA1700", label: "LGA1700" },
              { value: "LGA1851", label: "LGA1851" },
            ]}
          />
          <FilterSelect
            id="tipo_de_memoria"
            label="Tipo de memoria"
            value={filters.tipo_de_memoria || ""}
            onChange={(value) => handleFilterChange("tipo_de_memoria", value)}
            options={[
              { value: "DDR4", label: "DDR4" },
              { value: "DDR5", label: "DDR5" },
            ]}
          />
          <FilterSlider
            id="ranuras_de_ram"
            label="Ranuras de RAM"
            value={filters.ranuras_de_ram || [2, 8]}
            onChange={(value) => handleFilterChange("ranuras_de_ram", value)}
            min={2}
            max={8}
            step={2}
          />
          <FilterSlider
            id="ranuras_m2"
            label="Ranuras M.2"
            value={filters.ranuras_m2 || [0, 5]}
            onChange={(value) => handleFilterChange("ranuras_m2", value)}
            min={0}
            max={5}
            step={1}
          />
          <FilterCheckbox
            id="redes_inalambricas"
            label="WiFi incluido"
            checked={filters.redes_inalambricas}
            onChange={(checked) => handleFilterChange("redes_inalambricas", checked)}
          />
        </>
      );
    case "power-supply":
      return (
        <>
          <FilterSlider
            id="potencia"
            label="Potencia (W)"
            value={filters.potencia || [0, 1500]}
            onChange={(value) => handleFilterChange("potencia", value)}
            min={0}
            max={1500}
            step={100}
          />
          <FilterSelect
            id="calificacion_de_eficiencia"
            label="Certificación"
            value={filters.calificacion_de_eficiencia || ""}
            onChange={(value) => handleFilterChange("calificacion_de_eficiencia", value)}
            options={[
              { value: "80+ White", label: "80+ White" },
              { value: "80+ Bronze", label: "80+ Bronze" },
              { value: "80+ Silver", label: "80+ Silver" },
              { value: "80+ Gold", label: "80+ Gold" },
              { value: "80+ Platinum", label: "80+ Platinum" },
              { value: "80+ Titanium", label: "80+ Titanium" },
            ]}
          />
          <FilterCheckbox
            id="modular"
            label="Modular"
            checked={filters.modular}
            onChange={(checked) => handleFilterChange("modular", checked)}
          />
          <FilterSelect
            id="factor_de_forma"
            label="Factor de forma"
            value={filters.factor_de_forma || ""}
            onChange={(value) => handleFilterChange("factor_de_forma", value)}
            options={[
              { value: "ATX", label: "ATX" },
              { value: "SFX", label: "SFX" },
              { value: "SFX-L", label: "SFX-L" },
            ]}
          />
          <FilterSlider
            id="longitud"
            label="Longitud (mm)"
            value={filters.longitud || [0, 250]}
            onChange={(value) => handleFilterChange("longitud", value)}
            min={0}
            max={250}
            step={10}
          />
        </>
      );
    case "cpu":
      return (
        <>
          <FilterSelect
            id="enchufe"
            label="Socket"
            value={filters.enchufe || ""}
            onChange={(value) => handleFilterChange("enchufe", value)}
            options={[
              { value: "AM4", label: "AM4" },
              { value: "AM5", label: "AM5" },
              { value: "LGA1200", label: "LGA1200" },
              { value: "LGA1700", label: "LGA1700" },
              { value: "LGA1851", label: "LGA1851" },
            ]}
          />
          <FilterSlider
            id="nucleos"
            label="Núcleos"
            value={filters.nucleos || [2, 32]}
            onChange={(value) => handleFilterChange("nucleos", value)}
            min={2}
            max={32}
            step={2}
          />
          <FilterSlider
            id="reloj_base"
            label="Frecuencia base (GHz)"
            value={filters.reloj_base || [1, 6]}
            onChange={(value) => handleFilterChange("reloj_base", value)}
            min={1}
            max={6}
            step={0.1}
          />
          <FilterSlider
            id="tdp"
            label="TDP (W)"
            value={filters.tdp || [15, 250]}
            onChange={(value) => handleFilterChange("tdp", value)}
            min={15}
            max={250}
            step={5}
          />
          <FilterCheckbox
            id="enfriador_incluido"
            label="Cooler incluido"
            checked={filters.enfriador_incluido}
            onChange={(checked) => handleFilterChange("enfriador_incluido", checked)}
          />
          <FilterCheckbox
            id="gpu_integrada"
            label="GPU integrada"
            checked={filters.gpu_integrada}
            onChange={(checked) => handleFilterChange("gpu_integrada", checked)}
          />
        </>
      );
    case "storage":
      return (
        <>
          <FilterSelect
            id="tipo_de_almacenamiento"
            label="Tipo"
            value={filters.tipo_de_almacenamiento || ""}
            onChange={(value) => handleFilterChange("tipo_de_almacenamiento", value)}
            options={[
              { value: "SSD", label: "SSD" },
              { value: "HDD", label: "HDD" },
              { value: "NVMe", label: "NVMe" },
            ]}
          />
          <FilterSelect
            id="capacidad"
            label="Capacidad"
            value={filters.capacidad || ""}
            onChange={(value) => handleFilterChange("capacidad", value)}
            options={[
              { value: "250GB", label: "250GB" },
              { value: "500GB", label: "500GB" },
              { value: "1TB", label: "1TB" },
              { value: "2TB", label: "2TB" },
              { value: "4TB", label: "4TB" },
              { value: "8TB", label: "8TB" },
            ]}
          />
          <FilterSelect
            id="interfaz"
            label="Interfaz"
            value={filters.interfaz || ""}
            onChange={(value) => handleFilterChange("interfaz", value)}
            options={[
              { value: "SATA", label: "SATA" },
              { value: "PCIe 3.0", label: "PCIe 3.0" },
              { value: "PCIe 4.0", label: "PCIe 4.0" },
              { value: "PCIe 5.0", label: "PCIe 5.0" },
            ]}
          />
          <FilterSelect
            id="factor_de_forma"
            label="Factor de forma"
            value={filters.factor_de_forma || ""}
            onChange={(value) => handleFilterChange("factor_de_forma", value)}
            options={[
              { value: "2.5\"", label: "2.5\"" },
              { value: "3.5\"", label: "3.5\"" },
              { value: "M.2", label: "M.2" },
            ]}
          />
          <FilterCheckbox
            id="compatibilidad_con_nvme"
            label="Compatible NVMe"
            checked={filters.compatibilidad_con_nvme}
            onChange={(checked) => handleFilterChange("compatibilidad_con_nvme", checked)}
          />
        </>
      );
    default:
      return null;
  }
}

interface FilterSliderProps {
  id: string;
  label: string;
  value: number[];
  onChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
}

function FilterSlider({ id, label, value, onChange, min, max, step }: FilterSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id} className="text-sm text-white">{label}</Label>
        <span className="text-xs text-white">{value[0]} - {value[1]}</span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onChange}
        className="w-full"
      />
    </div>
  );
}

interface FilterCheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
}

function FilterCheckbox({ id, label, checked, onChange }: FilterCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-blue-500"
      />
      <Label htmlFor={id} className="text-sm text-white">{label}</Label>
    </div>
  );
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function FilterSelect({ id, label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm text-white">{label}</Label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value === "__all__" ? "" : value)}
      >
        <SelectTrigger id={id} className="bg-black/30 border-white/10 text-white">
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/10 text-white">
          <SelectItem value="__all__">Todos</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
