"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  warehouses: string[];
  selectedWarehouse: string;
  onWarehouseChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  warehouses,
  selectedWarehouse,
  onWarehouseChange,
  categories,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหา SKU, ชื่อสินค้า..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <select
        value={selectedWarehouse}
        onChange={(e) => onWarehouseChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">คลังทั้งหมด</option>
        {warehouses.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">หมวดหมู่ทั้งหมด</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">สถานะทั้งหมด</option>
        <option value="normal">✅ ปกติ</option>
        <option value="low">⚠️ สต็อกต่ำ</option>
        <option value="out">🔴 หมดสต็อก</option>
      </select>
    </div>
  );
}
