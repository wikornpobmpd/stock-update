import { Badge } from "@/components/ui/badge";
import { type Product, getStockStatus } from "@/lib/types";

interface StockBadgeProps {
  product: Product;
}

export function StockBadge({ product }: StockBadgeProps) {
  const status = getStockStatus(product);

  if (status === "out") {
    return <Badge variant="danger">🔴 หมดสต็อก</Badge>;
  }
  if (status === "low") {
    return <Badge variant="warning">⚠️ สต็อกต่ำ</Badge>;
  }
  return <Badge variant="success">✅ ปกติ</Badge>;
}
