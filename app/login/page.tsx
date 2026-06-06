"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--brand-warm)" }}
    >
      {/* Logo card */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
          style={{ background: "#F36E23" }}
        >
          🐾
        </div>
        <div className="text-center">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-fredoka)", color: "#F36E23" }}
          >
            Hosttail Stock
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#888" }}>
            ระบบจัดการสินค้าคงคลัง · bebeplay
          </p>
        </div>
      </div>

      {/* Login card */}
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "#fff",
          border: "1.5px solid #F3C4AA",
          boxShadow: "0 4px 24px rgba(243,110,35,0.10)",
        }}
      >
        <h2
          className="text-lg font-bold mb-6"
          style={{ fontFamily: "var(--font-fredoka)", color: "#2D2D2D" }}
        >
          เข้าสู่ระบบ
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#888" }}>
              อีเมล
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full h-11 rounded-xl border px-3 text-sm outline-none transition-all"
              style={{
                borderColor: "#F3C4AA",
                fontFamily: "var(--font-sarabun)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "#888" }}>
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-11 rounded-xl border px-3 text-sm outline-none transition-all"
              style={{
                borderColor: "#F3C4AA",
                fontFamily: "var(--font-sarabun)",
              }}
            />
          </div>

          {error && (
            <div
              className="rounded-xl px-4 py-2.5 text-sm"
              style={{ background: "#FFEAEA", color: "#E84040", border: "1px solid #FFBBBB" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
            style={{
              background: loading ? "#F3C4AA" : "#F36E23",
              fontFamily: "var(--font-fredoka)",
              fontSize: "1rem",
            }}
          >
            {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs" style={{ color: "#F3C4AA" }}>
        Hosttail Stock Dashboard · Powered by Supabase 🐾
      </p>
    </div>
  );
}
