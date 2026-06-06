import { type Product, getStockStatus } from "@/lib/types";

interface StockBadgeProps {
  product: Product;
}

export function StockBadge({ product }: StockBadgeProps) {
  const status = getStockStatus(product);

  if (status === "out") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
        style={{ background: "#E84040" }}
      >
        <span className="text-[10px]">●</span> หมดสต็อก
      </span>
    );
  }

  if (status === "low") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
        style={{ background: "#F36E23" }}
      >
        <span className="text-[10px]">●</span> สต็อกต่ำ
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
      style={{ background: "#46C9D5" }}
    >
      <span className="text-[10px]">●</span> ปกติ
    </span>
  );
}
