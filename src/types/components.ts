
export interface Price {
  valor: number;
  moneda: string;
}

export interface PriceInfo {
  Cantidad: number;
  Precio: Price;
}

export interface Prices {
  Nuevos?: PriceInfo;
  Utilizados?: PriceInfo;
}

export interface Component {
  _id: string;
  Nombre: string;
  Marca: string;
  Características: Record<string, string>;
  Precios: Prices;
  categoria: string;
  URL: string;
  Imagen?: string; // Added Imagen field which contains the Amazon image URL
  Descripción?: string; // Added Descripción field for component description
  
  // Case specific properties
  dimensiones?: string;
  ranuras_de_expansion_de_altura?: string;
  conectores_frontales?: string;
  longitud_maxima_de_gpu?: number;
  tamanos_de_bahias?: string;
  factores_de_forma?: string[];

  // Cooler specific properties
  ruido_maximo?: number;
  refrigerado_por_agua?: boolean;
  altura?: number;
  sin_ventilador?: boolean;
  rpm_maximas?: number;
  longitud_del_radiador?: number;

  // GPU specific properties
  reloj_de_nucleo?: number;
  sincronizacion_de_fotogramas?: string;
  tdp?: number;
  puertos?: string[];
  memoria?: number;
  pcie_de_8_pines?: number;
  tipo_de_memoria?: string;
  reloj_de_impulso?: number;
  pcie_de_6_pines?: number;
  radiador?: boolean;
  reloj_de_memoria_eficaz?: number;
  interfaz?: string;
  longitud?: number;

  // RAM specific properties
  latencia_cas?: number;
  refrigeracion_pasiva?: boolean;
  voltaje?: number;
  configuracion?: string;
  velocidad?: number;

  // Motherboard specific properties
  redes_inalambricas?: boolean;
  conjunto_de_chips?: string;
  factor_de_forma?: string;
  puertos_ethernet?: number;
  ranuras_m2?: number;
  soporte_de_gpu_integrado?: boolean;
  enchufe?: string;
  ram_maxima?: number;
  ranuras_de_ram?: number;

  // Power supply specific properties
  potencia?: number;
  modular?: boolean;
  calificacion_de_eficiencia?: string;

  // CPU specific properties
  litografia?: number;
  nucleos?: number;
  turbo_reloj?: number;
  enfriador_incluido?: boolean;
  gpu_integrada?: boolean;
  reloj_base?: number;

  // Storage specific properties
  tipo_de_almacenamiento?: string;
  capacidad?: string;
  tipo_m2?: string;
  compatibilidad_con_nvme?: boolean;
  controlador_ssd?: string;
  cache?: number;
  rpm?: number;
}

export type ComponentCategory =
  | "case"
  | "cpu"
  | "gpu"
  | "motherboard"
  | "power-supply"
  | "memory"
  | "storage"
  | "cooler";
