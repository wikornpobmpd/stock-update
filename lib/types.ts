export type StockStatus = "normal" | "low" | "out";

export interface Product {
  id: string;
  sku: string;
  variant_code: string | null;
  name: string;
  short_name: string | null;
  image_url: string | null;
  category: string | null;
  brand: string | null;
  supplier: string | null;
  unit: string;
  warehouse_name: string | null;

  // Stock levels
  quantity: number;
  available_qty: number;
  in_procurement: number;
  locked_qty: number;
  damaged_qty: number;
  return_qty: number;
  incoming_qty: number;

  // Alert thresholds
  min_quantity: number;
  max_quantity: number;

  // Sales velocity
  sales_7d: number;
  sales_30d: number;

  // Pricing
  selling_price: number | null;
  cost_price: number | null;

  created_at: string;
  updated_at: string;
}

export interface StockStats {
  total: number;
  normal: number;
  low: number;
  out: number;
}

export function getStockStatus(product: Product): StockStatus {
  if (product.available_qty <= 0) return "out";
  if (product.available_qty <= product.min_quantity) return "low";
  return "normal";
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
    };
  };
};
