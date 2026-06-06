interface AlertBannerProps {
  lowCount: number;
  outCount: number;
}

export function AlertBanner({ lowCount, outCount }: AlertBannerProps) {
  if (lowCount === 0 && outCount === 0) return null;

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <div className="flex items-start gap-3">
        <span className="text-yellow-600 text-lg">⚠️</span>
        <div>
          <h3 className="font-semibold text-yellow-800">แจ้งเตือนสต็อก</h3>
          <div className="text-sm text-yellow-700 mt-1 space-y-0.5">
            {outCount > 0 && (
              <p>
                🔴 <strong>{outCount.toLocaleString()} รายการ</strong> หมดสต็อกแล้ว
              </p>
            )}
            {lowCount > 0 && (
              <p>
                🟡 <strong>{lowCount.toLocaleString()} รายการ</strong>{" "}
                สต็อกต่ำกว่า minimum — ควรสั่งเพิ่ม
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
