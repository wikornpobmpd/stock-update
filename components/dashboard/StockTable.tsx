"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { StockBadge } from "@/components/dashboard/StockBadge";
import { type Product, getStockStatus, type StockStatus } from "@/lib/types";

const PAGE_SIZE = 100;

interface StockTableProps {
  initialProducts: Product[];
}

export function StockTable({ initialProducts }: StockTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(1);

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
              prev.map((p) =>
                p.id === payload.new.id ? (payload.new as Product) : p
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const warehouses = useMemo(
    () =>
      [...new Set(products.map((p) => p.warehouse_name).filter(Boolean))] as string[],
    [products]
  );
  const categories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category).filter(Boolean))] as string[],
    [products]
  );

  const filtered = useMemo(() => {
    setPage(1);
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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "#888" }}>
          แสดง{" "}
          <span className="font-semibold" style={{ color: "#F36E23" }}>
            {((page - 1) * PAGE_SIZE + 1).toLocaleString()}–{Math.min(page * PAGE_SIZE, filtered.length).toLocaleString()}
          </span>{" "}
          จาก{" "}
          <span className="font-semibold" style={{ color: "#F36E23" }}>
            {filtered.length.toLocaleString()}
          </span>{" "}
          รายการ
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">Realtime</span>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid #F3C4AA", boxShadow: "0 2px 12px rgba(243,110,35,0.06)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#FFF0E6" }}>
              <th className="h-11 px-4 text-left font-semibold w-14" style={{ color: "#F36E23", fontFamily: "var(--font-fredoka)", fontSize: "0.8rem" }}>
                รูป
              </th>
              <th className="h-11 px-4 text-left font-semibold" style={{ color: "#F36E23", fontFamily: "var(--font-fredoka)", fontSize: "0.8rem" }}>
                SKU
              </th>
              <th className="h-11 px-4 text-left font-semibold" style={{ color: "#F36E23", fontFamily: "var(--font-fredoka)", fontSize: "0.8rem" }}>
                ชื่อสินค้า
              </th>
              <th className="h-11 px-4 text-left font-semibold hidden md:table-cell" style={{ color: "#F36E23", fontFamily: "var(--font-fredoka)", fontSize: "0.8rem" }}>
                คลัง
              </th>
              <th className="h-11 px-4 text-right font-semibold" style={{ color: "#F36E23", fontFamily: "var(--font-fredoka)", fontSize: "0.8rem" }}>
                คงเหลือ
              </th>
              <th className="h-11 px-4 text-right font-semibold hidden sm:table-cell" style={{ color: "#F36E23", fontFamily: "var(--font-fredoka)", fontSize: "0.8rem" }}>
                MIN
              </th>
              <th className="h-11 px-4 text-right font-semibold hidden lg:table-cell" style={{ color: "#F36E23", fontFamily: "var(--font-fredoka)", fontSize: "0.8rem" }}>
                ขาย 7วัน
              </th>
              <th className="h-11 px-4 text-left font-semibold" style={{ color: "#F36E23", fontFamily: "var(--font-fredoka)", fontSize: "0.8rem" }}>
                สถานะ
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="h-32 text-center"
                  style={{ color: "#F3C4AA" }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">🐾</span>
                    <span className="text-sm">ไม่พบสินค้าที่ค้นหา</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((product, idx) => (
                <tr
                  key={product.id}
                  className="stock-row border-t"
                  style={{
                    borderColor: "#FFE8D6",
                    background: idx % 2 === 0 ? "#ffffff" : "#FFFAF7",
                  }}
                >
                  <td className="px-4 py-2.5">
                    {product.image_url ? (
                      <div
                        className="relative h-10 w-10 rounded-xl overflow-hidden"
                        style={{ border: "1.5px solid #F3C4AA" }}
                      >
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
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-base"
                        style={{ background: "#FFF0E6", color: "#F3C4AA" }}
                      >
                        🐾
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="font-mono text-xs px-2 py-0.5 rounded-lg"
                      style={{ background: "#FFF0E6", color: "#F36E23" }}
                    >
                      {product.sku}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-medium line-clamp-2 max-w-xs text-sm" style={{ color: "#2D2D2D" }}>
                      {product.name}
                    </div>
                    {product.brand && (
                      <div className="text-xs mt-0.5" style={{ color: "#46C9D5" }}>
                        {product.brand}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs hidden md:table-cell" style={{ color: "#888" }}>
                    {product.warehouse_name || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span
                      className="font-bold text-base"
                      style={{
                        color:
                          product.available_qty <= 0
                            ? "#E84040"
                            : product.available_qty <= product.min_quantity
                            ? "#F36E23"
                            : "#46C9D5",
                        fontFamily: "var(--font-fredoka)",
                      }}
                    >
                      {product.available_qty.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs hidden sm:table-cell" style={{ color: "#888" }}>
                    {product.min_quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs hidden lg:table-cell" style={{ color: "#888" }}>
                    {product.sales_7d.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">
                    <StockBadge product={product} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs" style={{ color: "#888" }}>
            หน้า {page} / {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 px-3 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
              style={{
                background: page === 1 ? "#F5F5F5" : "#FFF0E6",
                color: page === 1 ? "#aaa" : "#F36E23",
                border: "1.5px solid",
                borderColor: page === 1 ? "#eee" : "#F3C4AA",
              }}
            >
              ← ก่อนหน้า
            </button>

            {/* page number pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p: number;
                if (totalPages <= 7) {
                  p = i + 1;
                } else if (page <= 4) {
                  p = i + 1;
                } else if (page >= totalPages - 3) {
                  p = totalPages - 6 + i;
                } else {
                  p = page - 3 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="h-8 w-8 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: p === page ? "#F36E23" : "#FFF0E6",
                      color: p === page ? "#fff" : "#F36E23",
                      border: "1.5px solid",
                      borderColor: p === page ? "#F36E23" : "#F3C4AA",
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 px-3 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
              style={{
                background: page === totalPages ? "#F5F5F5" : "#FFF0E6",
                color: page === totalPages ? "#aaa" : "#F36E23",
                border: "1.5px solid",
                borderColor: page === totalPages ? "#eee" : "#F3C4AA",
              }}
            >
              ถัดไป →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
