import type { StockStats } from "@/lib/types";

interface StatsCardsProps {
  stats: StockStats;
}

const cards = [
  {
    key: "total" as const,
    label: "สินค้าทั้งหมด",
    icon: "📦",
    color: "#F36E23",
    bg: "#FFF0E6",
    border: "#F3C4AA",
  },
  {
    key: "normal" as const,
    label: "สต็อกปกติ",
    icon: "✅",
    color: "#46C9D5",
    bg: "#E6F9FB",
    border: "#A8E8EE",
  },
  {
    key: "low" as const,
    label: "สต็อกต่ำ",
    icon: "⚠️",
    color: "#FF8C42",
    bg: "#FFF4E8",
    border: "#FFD4B0",
  },
  {
    key: "out" as const,
    label: "หมดสต็อก",
    icon: "🔴",
    color: "#E84040",
    bg: "#FFEAEA",
    border: "#FFBBBB",
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const value = stats[card.key];
        const pct =
          card.key !== "total" && stats.total > 0
            ? Math.round((value / stats.total) * 100)
            : null;

        return (
          <div
            key={card.key}
            className="stat-card rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "#ffffff",
              border: `1.5px solid ${card.border}`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            {/* colored accent bar top */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ background: card.color }}
            />

            {/* icon bubble */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
              style={{ background: card.bg }}
            >
              {card.icon}
            </div>

            <p
              className="text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: card.color, fontFamily: "var(--font-sarabun)" }}
            >
              {card.label}
            </p>
            <p
              className="text-3xl font-bold leading-none"
              style={{ color: card.color, fontFamily: "var(--font-fredoka)" }}
            >
              {value.toLocaleString()}
            </p>
            {pct !== null && (
              <p className="text-xs text-gray-400 mt-1">{pct}% ของทั้งหมด</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
