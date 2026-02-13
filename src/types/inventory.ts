export interface Product {
  id: string;
  name: string;
  brand: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  category: string;
  notes: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  salePrice: number;
  purchasePrice: number;
  platform: string;
  createdAt: string;
}

export type Category = "Sneakers" | "Streetwear" | "Accessori" | "Elettronica" | "Altro";

export const CATEGORIES: Category[] = ["Sneakers", "Streetwear", "Accessori", "Elettronica", "Altro"];

export const PLATFORMS = ["StockX", "GOAT", "Vinted", "Subito", "eBay", "Instagram", "Negozio", "Altro"];
