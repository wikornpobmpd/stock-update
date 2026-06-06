"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { StockBadge } from "@/components/dashboard/StockBadge";
import { type Product, getStockStatus, type StockStatus } from "@/lib/types";

interface StockTableProps {
  initialProducts: Product[];
}

export function StockTable({ initialProducts }: StockTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Supabase Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProducts((prev) => [payload.new as Product, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setProducts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Product) : p))
            );
          } else if (payload.eventType === "DELETE") {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Unique warehouse and category lists for filters
  const warehouses = useMemo(
    () => [...new Set(products.map((p) => p.warehouse_name).filter(Boolean))] as string[],
    [products]
  );
  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))] as string[],
    [products]
  );

  // Filtered products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.name.toLowerCase().includes(search.toLowerCase());
      const matchWarehouse = !selectedWarehouse || p.warehouse_name === selectedWarehouse;
      const matchCategory = !selectedCategory || p.category === selectedCategory;
      const matchStatus =
        !selectedStatus || getStockStatus(p) === (selectedStatus as StockStatus);
      return matchSearch && matchWarehouse && matchCategory && matchStatus;
    });
  }, [products, search, selectedWarehouse, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        warehouses={warehouses}
        selectedWarehouse={selectedWarehouse}
        onWarehouseChange={setSelectedWarehouse}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <div className="text-sm text-muted-foreground">
        แสดง {filtered.length.toLocaleString()} จาก {products.length.toLocaleString()} รายการ
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-4 text-left font-medium text-muted-foreground w-16">รูป</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">SKU</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">ชื่อสินค้า</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">
                คลัง
              </th>
              <th className="h-10 px-4 text-right font-medium text-muted-foreground">คงเหลือ</th>
              <th className="h-10 px-4 text-right font-medium text-muted-foreground hidden sm:table-cell">
                MIN
              </th>
              <th className="h-10 px-4 text-right font-medium text-muted-foreground hidden lg:table-cell">
                ขาย 7วัน
              </th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="h-24 text-center text-muted-foreground">
                  ไม่พบสินค้าที่ค้นหา
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2">
                    {product.image_url ? (
                      <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                          onError={() => {}}
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        —
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-medium line-clamp-2 max-w-xs">{product.name}</div>
                    {product.brand && (
                      <div className="text-xs text-muted-foreground">{product.brand}</div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground hidden md:table-cell">
                    {product.warehouse_name || "—"}
                  </td>
                  <td className="px-4 py-2 text-right font-semibold">
                    {product.available_qty.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right text-muted-foreground hidden sm:table-cell">
                    {product.min_quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right text-muted-foreground hidden lg:table-cell">
                    {product.sales_7d.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <StockBadge product={product} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
