import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockStats } from "@/lib/types";

interface StatsCardsProps {
  stats: StockStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            สินค้าทั้งหมด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">รายการ</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">สต็อกปกติ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.normal.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total > 0 ? Math.round((stats.normal / stats.total) * 100) : 0}% ของทั้งหมด
          </p>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-700">⚠️ สต็อกต่ำ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.low.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">รายการที่ต้องเติม</p>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-700">🔴 หมดสต็อก</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.out.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">รายการที่หมดแล้ว</p>
        </CardContent>
      </Card>
    </div>
  );
}
