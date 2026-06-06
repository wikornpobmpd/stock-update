# Task Tracker — Phase 1

## Setup

- [x] Initialize Next.js 15 project
- [x] Install dependencies (Supabase, shadcn/ui, xlsx, ts-node)
- [x] Configure TypeScript, Tailwind, ESLint
- [x] Create `.gitignore`

## Database

- [x] Create `supabase/migrations/001_create_products.sql`
- [ ] Apply migration ใน Supabase (ต้องใช้ Supabase MCP หรือ Dashboard)
- [ ] Enable Realtime บน `products` table

## Data Import

- [ ] ตั้งค่า `.env.local` (ใส่ Supabase credentials)
- [ ] รัน import script: `npx ts-node --project tsconfig.scripts.json scripts/import-excel.ts`
- [ ] Verify ข้อมูลใน Supabase Dashboard

## Frontend

- [x] สร้าง TypeScript types (`lib/types.ts`)
- [x] สร้าง Supabase client files (`lib/supabase/client.ts`, `server.ts`)
- [x] สร้าง UI components:
  - [x] `StockBadge.tsx`
  - [x] `StatsCards.tsx`
  - [x] `AlertBanner.tsx`
  - [x] `FilterBar.tsx`
  - [x] `StockTable.tsx` (Realtime)
- [x] สร้าง Dashboard page (`app/page.tsx`)

## Claude Configuration

- [x] `.claude/settings.json` (permissions + hooks)
- [x] `.claude/commands/add-product.md`
- [x] `.claude/commands/update-stock.md`
- [x] `.claude/commands/import-excel.md`
- [x] `.claude/commands/generate-migration.md`
- [x] `CLAUDE.md` (project context)

## GitHub

- [ ] `git init` + initial commit
- [ ] สร้าง GitHub repository
- [ ] Push ขึ้น GitHub
- [ ] ตรวจสอบ `.gitignore` (ไม่รวม `.env.local`)

## CI/CD

- [x] `.github/workflows/ci.yml` (TypeCheck + Lint)
- [ ] Connect Vercel กับ GitHub repo
- [ ] ตั้งค่า Environment Variables ใน Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] ทดสอบ production build บน Vercel

## Testing & Verification

- [ ] `npm run typecheck` — ผ่านไม่มี error
- [ ] `npm run build` — build สำเร็จ
- [ ] `npm run dev` → เปิด localhost:3000 → ดู Dashboard
- [ ] ทดสอบ Realtime: แก้ `available_qty` ใน Supabase → ดู dashboard อัพเดท
- [ ] ทดสอบ Alert: ตั้ง `available_qty = 0` → ดู AlertBanner
