
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
