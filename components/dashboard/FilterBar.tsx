"use client";

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

const inputBase =
  "h-10 rounded-xl border text-sm px-3 bg-white transition-all outline-none w-full";
const inputStyle = {
  borderColor: "#F3C4AA",
  fontFamily: "var(--font-sarabun)",
};

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
      {/* Search */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="ค้นหา SKU, ชื่อสินค้า..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={inputBase}
          style={{ ...inputStyle, paddingLeft: "2.25rem" }}
        />
      </div>

      {/* Warehouse */}
      <select
        value={selectedWarehouse}
        onChange={(e) => onWarehouseChange(e.target.value)}
        className={inputBase}
        style={{ ...inputStyle, minWidth: 140 }}
      >
        <option value="">🏪 คลังทั้งหมด</option>
        {warehouses.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>

      {/* Category */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={inputBase}
        style={{ ...inputStyle, minWidth: 140 }}
      >
        <option value="">🏷️ หมวดหมู่ทั้งหมด</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className={inputBase}
        style={{ ...inputStyle, minWidth: 140 }}
      >
        <option value="">📊 สถานะทั้งหมด</option>
        <option value="normal">● ปกติ</option>
        <option value="low">● สต็อกต่ำ</option>
        <option value="out">● หมดสต็อก</option>
      </select>
    </div>
  );
}
