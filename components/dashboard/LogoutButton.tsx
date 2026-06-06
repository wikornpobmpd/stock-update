"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-medium transition-all"
      style={{
        background: "rgba(255,255,255,0.15)",
        color: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(255,255,255,0.25)",
      }}
    >
      <span>ออกจากระบบ</span>
    </button>
  );
}
