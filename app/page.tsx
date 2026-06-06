import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { StockTable } from "@/components/dashboard/StockTable";
import { type Product, type StockStats, getStockStatus } from "@/lib/types";

export const revalidate = 0; // ไม่ cache — ดึงข้อมูลสดเสมอ

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("available_qty", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data as Product[];
}

function computeStats(products: Product[]): StockStats {
  return products.reduce(
    (acc, p) => {
      const status = getStockStatus(p);
      acc.total++;
      acc[status]++;
      return acc;
    },
    { total: 0, normal: 0, low: 0, out: 0 } as StockStats
  );
}

export default async function DashboardPage() {
  const products = await getProducts();
  const stats = computeStats(products);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">📦 Stock Update Dashboard</h1>
            <p className="text-sm text-muted-foreground">bebeplay · Realtime Inventory</p>
          </div>
          <div className="text-xs text-muted-foreground">
            อัพเดทอัตโนมัติแบบ Realtime
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary cards */}
        <StatsCards stats={stats} />

        {/* Alert banner */}
        <AlertBanner lowCount={stats.low} outCount={stats.out} />

        {/* Stock table with filters + realtime */}
        <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
          <h2 className="text-base font-semibold mb-4">รายการสินค้าคงคลัง</h2>
          <StockTable initialProducts={products} />
        </div>
      </div>
    </main>
  );
}
