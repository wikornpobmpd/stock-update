interface AlertBannerProps {
  lowCount: number;
  outCount: number;
}

export function AlertBanner({ lowCount, outCount }: AlertBannerProps) {
  if (lowCount === 0 && outCount === 0) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid #FFD4B0" }}
    >
      {/* header strip */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ background: "#F36E23" }}
      >
        <span className="text-lg">🔔</span>
        <span
          className="font-bold text-white text-sm tracking-wide"
          style={{ fontFamily: "var(--font-fredoka)", fontSize: "1rem" }}
        >
          แจ้งเตือนสต็อก
        </span>
      </div>

      {/* body */}
      <div
        className="px-5 py-4 flex flex-col sm:flex-row gap-3"
        style={{ background: "#FFF0E6" }}
      >
        {outCount > 0 && (
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 flex-1" style={{ border: "1.5px solid #FFBBBB" }}>
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: "#E84040" }}
            >
              {outCount}
            </span>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#E84040" }}>
                หมดสต็อก
              </p>
              <p className="text-xs text-gray-500">รายการที่ต้องสั่งซื้อด่วน</p>
            </div>
          </div>
        )}

        {lowCount > 0 && (
          <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 flex-1" style={{ border: "1.5px solid #FFD4B0" }}>
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: "#F36E23" }}
            >
              {lowCount}
            </span>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#F36E23" }}>
                สต็อกต่ำ
              </p>
              <p className="text-xs text-gray-500">รายการที่ควรเติมเร็วๆ นี้</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
