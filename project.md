# Stock Update Dashboard — Project Overview

## วัตถุประสงค์

ระบบแสดงและจัดการสินค้าคงคลัง (Inventory) แบบ real-time สำหรับ bebeplay/MPD Group
แก้ปัญหาการ track stock ด้วย Excel ที่ไม่มี visibility แบบ live และไม่มีการแจ้งเตือนอัตโนมัติ

## Phase 1 (Current)

- [x] Dashboard แสดงสต็อกทั้งหมดแบบ real-time
- [x] แจ้งเตือนสต็อกต่ำอัตโนมัติ (Low Stock Alert)
- [x] Filter ตาม warehouse, category, status
- [x] Search ด้วย SKU หรือชื่อสินค้า
- [x] Import ข้อมูลจาก Excel

## Phase 2 (Future)

- [ ] Export CSV
- [ ] Import Excel ผ่าน UI (drag & drop)
- [ ] Stock movement history (รับเข้า/จ่ายออก)
- [ ] Authentication (Supabase Auth)
- [ ] Mobile app / LINE Notify

## Tech Stack

| Layer      | Technology                        | Version |
|------------|-----------------------------------|---------|
| Framework  | Next.js (App Router)              | 15.x    |
| Language   | TypeScript                        | 5.x     |
| UI         | Tailwind CSS + shadcn/ui          | 3.x     |
| Database   | Supabase (PostgreSQL + Realtime)  | -       |
| Hosting    | Vercel                            | -       |

## Project Links

| Resource    | URL |
|-------------|-----|
| Repository  | https://github.com/wikornpobmpd/stock-update |
| Production  | (Vercel URL — กรอกหลัง deploy) |
| Supabase    | https://supabase.com/dashboard/project/ovpyzkglagcsjwhwpymy |

## Data Sources

| File | Rows | Description |
|------|------|-------------|
| `warehouseInventory.xlsx` | 1,215 | ข้อมูล stock จากคลัง (24 columns) |
| `Product JST.xlsx` | 2,383 | ข้อมูลสินค้า + MIN/MAX thresholds (54 columns) |

## Team

| Role | Name |
|------|------|
| Developer | - |
| Stakeholder | bebeplay / MPD Group |

## Getting Started

```bash
# 1. Clone repo
git clone <repo-url>
cd Inventory_master

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# แก้ไข .env.local ใส่ Supabase credentials

# 4. Import Excel data
npx ts-node --project tsconfig.scripts.json scripts/import-excel.ts

# 5. Start dev server
npm run dev
# เปิด http://localhost:3000
```
