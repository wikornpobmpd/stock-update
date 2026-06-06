import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { StockTable } from "@/components/dashboard/StockTable";
import { type Product, type StockStats, getStockStatus } from "@/lib/types";

export const revalidate = 0;

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
      const s = getStockStatus(p);
      acc.total++;
      acc[s]++;
      return acc;
    },
    { total: 0, normal: 0, low: 0, out: 0 } as StockStats
  );
}

export default async function DashboardPage() {
  const products = await getProducts();
  const stats = computeStats(products);
  const now = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-warm)" }}>

      {/* ── Brand Header ─────────────────────────────────────── */}
      <header
        className="h-pattern relative overflow-hidden"
        style={{ background: "#F36E23" }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">

            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                🐾
              </div>
              <div>
                <h1
                  className="text-white font-bold leading-none"
                  style={{
                    fontFamily: "var(--font-fredoka)",
                    fontSize: "1.5rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  Hosttail Stock
                </h1>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  ระบบจัดการสินค้าคงคลัง · bebeplay
                </p>
              </div>
            </div>

            {/* Date + Realtime indicator */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                <span className="text-xs text-white/80">อัพเดทอัตโนมัติ</span>
              </div>
              <span className="text-xs text-white/60">{now}</span>
            </div>
          </div>
        </div>

        {/* decorative wave bottom */}
        <div className="absolute -bottom-px left-0 right-0 overflow-hidden">
          <svg
            viewBox="0 0 1440 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: 28 }}
          >
            <path
              d="M0 0L48 4.7C96 9.3 192 18.7 288 22.3C384 26 480 24 576 19.3C672 14.7 768 6.7 864 5.3C960 4 1056 9.3 1152 13.3C1248 17.3 1344 20 1392 21.3L1440 22.7V28H1392C1344 28 1248 28 1152 28C1056 28 960 28 864 28C768 28 672 28 576 28C480 28 384 28 288 28C192 28 96 28 48 28H0V0Z"
              fill="#FFF8F4"
            />
          </svg>
        </div>
      </header>

      {/* ── Page Content ────────────────────────────────────── */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Alert */}
        <AlertBanner lowCount={stats.low} outCount={stats.out} />

        {/* Table section */}
        <div
          className="rounded-2xl p-5 sm:p-6"
          style={{
            background: "#ffffff",
            border: "1.5px solid #F3C4AA",
            boxShadow: "0 2px 16px rgba(243,110,35,0.06)",
          }}
        >
          {/* section header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: "#F36E23" }}
              />
              <h2
                className="font-bold text-lg"
                style={{
                  color: "#2D2D2D",
                  fontFamily: "var(--font-fredoka)",
                }}
              >
                รายการสินค้าคงคลัง
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick stat pills */}
              <span
                className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "#E6F9FB", color: "#46C9D5" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {stats.normal.toLocaleString()} ปกติ
              </span>
              <span
                className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "#FFF0E6", color: "#F36E23" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {(stats.low + stats.out).toLocaleString()} ต้องดูแล
              </span>
            </div>
          </div>

          <StockTable initialProducts={products} />
        </div>

        {/* Footer */}
        <p className="text-center text-xs pb-4" style={{ color: "#F3C4AA" }}>
          Hosttail Stock Dashboard · Powered by Supabase Realtime 🐾
        </p>
      </main>
    </div>
  );
}
