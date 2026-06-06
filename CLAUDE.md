# CLAUDE.md — Stock Update Dashboard

AI context สำหรับโปรเจ็คนี้ ให้ Claude Code อ่านก่อนทำงานทุกครั้ง

## โปรเจ็คนี้คืออะไร

เว็บไซต์อัพเดท Stock (Inventory Management Dashboard) สำหรับ bebeplay/MPD Group
- แสดงสต็อกสินค้าคงคลังแบบ real-time ผ่าน Supabase Realtime
- แจ้งเตือนเมื่อสต็อกต่ำกว่า minimum threshold
- ข้อมูลมาจาก `warehouseInventory.xlsx` (1,215 rows) และ `Product JST.xlsx` (2,383 rows)

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Framework  | Next.js 15 (App Router)           |
| Language   | TypeScript (strict mode)          |
| UI         | Tailwind CSS + shadcn/ui          |
| Database   | Supabase (PostgreSQL + Realtime)  |
| Hosting    | Vercel                            |
| DB Access  | Supabase MCP                      |

## Architecture

```
app/page.tsx          # Server Component — fetch initial data
components/
  dashboard/
    StockTable.tsx    # Client Component — handles Realtime + filters
    StatsCards.tsx    # Server Component — summary cards
    AlertBanner.tsx   # Server Component — low stock alert
    FilterBar.tsx     # Client Component — search + filters
    StockBadge.tsx    # Pure component — status badge
  ui/                 # shadcn/ui base components
lib/
  supabase/
    client.ts         # createBrowserClient (สำหรับ Client Components)
    server.ts         # createServerClient (สำหรับ Server Components)
  types.ts            # Product type, StockStats, getStockStatus()
  utils.ts            # cn() utility
scripts/
  import-excel.ts     # Excel → Supabase import (ใช้ ts-node)
supabase/
  migrations/         # SQL migration files
```

## Database Schema

### products table
```sql
id              uuid PK
sku             text UNIQUE NOT NULL      -- รหัสสินค้า (key)
variant_code    text                      -- รหัสรูปแบบ
name            text NOT NULL            -- ชื่อสินค้า
short_name      text                     -- ชื่อย่อ
image_url       text                     -- URL รูปภาพ
category        text                     -- หมวดหมู่
brand           text                     -- แบรนด์
supplier        text                     -- ชื่อผู้จำหน่าย
unit            text DEFAULT 'ชิ้น'
warehouse_name  text                     -- ชื่อคลังสินค้า

-- Stock quantities
quantity        integer                  -- สินค้าคงคลังรวม
available_qty   integer                  -- จํานวนที่ใช้ได้จริง (สำคัญ)
in_procurement  integer                  -- กำลังจัดซื้อ
locked_qty      integer                  -- ล็อคไว้
damaged_qty     integer                  -- ชำรุด
return_qty      integer                  -- คืนสินค้า
incoming_qty    integer                  -- กำลังเข้า

-- Alert thresholds
min_quantity    integer DEFAULT 10       -- LOW STOCK threshold (สำคัญ)
max_quantity    integer DEFAULT 100      -- reorder target

-- Sales velocity
sales_7d        integer                  -- ยอดขาย 7 วัน
sales_30d       integer                  -- ยอดขาย 30 วัน

-- Pricing
selling_price   numeric(10,2)
cost_price      numeric(10,2)

created_at      timestamptz
updated_at      timestamptz              -- auto-updated by trigger
```

### Alert Logic
```typescript
// ใน lib/types.ts — getStockStatus()
if (available_qty <= 0) → "out"         // 🔴 หมดสต็อก
if (available_qty <= min_quantity) → "low"  // ⚠️ สต็อกต่ำ
else → "normal"                         // ✅ ปกติ
```

## Environment Variables

```bash
# .env.local (ห้าม commit)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# สำหรับ import script เท่านั้น
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run typecheck    # TypeScript check (npx tsc --noEmit)
npm run lint         # ESLint

# Import Excel → Supabase
npx ts-node --project tsconfig.scripts.json scripts/import-excel.ts
```

## Supabase MCP

ใช้ Supabase MCP tools เพื่อจัดการ database:
- `list_projects` — ดู projects ทั้งหมด
- `list_tables` — ดู tables ใน project
- `execute_sql` — รัน SQL query
- `apply_migration` — apply migration file
- `get_logs` — ดู logs

## Coding Conventions

1. **TypeScript strict** — ห้ามใช้ `any` หรือ `as unknown as X`
2. **Server vs Client** — default เป็น Server Component, ใช้ `"use client"` เฉพาะเมื่อต้องการ state/effects
3. **Tailwind** — ใช้ Tailwind classes, ไม่เขียน CSS ตรงๆ
4. **No comments** — ยกเว้น WHY ที่ไม่ชัดเจน
5. **Import order** — React → Next.js → 3rd party → local

## Claude Slash Commands

- `/add-product` — เพิ่มสินค้าใหม่ใน Supabase
- `/update-stock` — อัพเดทจำนวนสต็อก
- `/import-excel` — นำเข้าข้อมูลจาก Excel
- `/generate-migration` — สร้าง SQL migration ใหม่

## Source Data Files (อยู่ใน project root)

- `warehouseInventory.xlsx` — ข้อมูล stock จากคลัง (24 columns, 1,215 rows)
- `Product JST.xlsx` — ข้อมูลสินค้า + MIN/MAX thresholds (54 columns, 2,383 rows)
