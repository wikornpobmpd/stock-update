/**
 * Import script: อ่านข้อมูลจาก Excel → upsert ไปยัง Supabase
 *
 * วิธีใช้:
 *   npx ts-node --project tsconfig.scripts.json scripts/import-excel.ts
 *
 * ต้องตั้งค่า .env.local ก่อน:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import * as XLSX from "xlsx";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// โหลด env vars
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ กรุณาตั้งค่า NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ใน .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const ROOT = path.resolve(__dirname, "..");

// ============================================================
// อ่าน warehouseInventory.xlsx
// Columns: ชื่อคลังสินค้า, รูปภาพ, รหัสสินค้า, รหัสรูปแบบ, รูปแบบสี,
//          ชื่อสินค้า, ชื่อย่อสินค้า, คีย์เวิร์ด, สินค้าคงคลัง,
//          สต๊อกระหว่างกำกับ, จำนวนล็อค, จำนวนออเดอร์, คลังคืน,
//          คลังเข้า, คลังชำรุด, จัดซื้อ, ยอดขาย3/7/15/30/60/90วัน,
//          เจ้าของสินค้า, จํานวนที่ใช้ได้
// ============================================================
function readWarehouseInventory(): Map<string, Record<string, unknown>> {
  const wb = XLSX.readFile(path.join(ROOT, "warehouseInventory.xlsx"));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: 0 });

  const map = new Map<string, Record<string, unknown>>();
  for (const row of rows) {
    const sku = String(row["รหัสสินค้า"] ?? "").trim();
    if (!sku) continue;
    map.set(sku, row);
  }
  console.log(`📦 warehouseInventory.xlsx: ${map.size} รายการ (unique SKU)`);
  return map;
}

// ============================================================
// อ่าน Product JST.xlsx
// Columns: รหัสSKU, รหัสรูปแบบ, ชื่อสินค้า, ..., MIN, MAX, etc.
// ============================================================
function readProductJST(): Map<string, Record<string, unknown>> {
  const wb = XLSX.readFile(path.join(ROOT, "Product JST.xlsx"));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: 0 });

  const map = new Map<string, Record<string, unknown>>();
  for (const row of rows) {
    const sku = String(row["รหัสSKU"] ?? "").trim();
    if (!sku) continue;
    map.set(sku, row);
  }
  console.log(`🏷️  Product JST.xlsx: ${map.size} รายการ (unique SKU)`);
  return map;
}

function toInt(val: unknown): number {
  const n = Number(val);
  return isNaN(n) ? 0 : Math.round(n);
}

function toFloat(val: unknown): number | null {
  const n = Number(val);
  return isNaN(n) || n === 0 ? null : Math.round(n * 100) / 100;
}

function toStr(val: unknown): string | null {
  const s = String(val ?? "").trim();
  return s && s !== "0" ? s : null;
}

// ============================================================
// รวมข้อมูลจาก 2 ไฟล์และ map ไปยัง schema
// ============================================================
function mergeData(
  warehouseMap: Map<string, Record<string, unknown>>,
  jstMap: Map<string, Record<string, unknown>>
) {
  const allSkus = new Set([...warehouseMap.keys(), ...jstMap.keys()]);
  const records = [];

  for (const sku of allSkus) {
    const w = warehouseMap.get(sku) ?? {};
    const j = jstMap.get(sku) ?? {};

    // ชื่อสินค้า: ใช้จาก JST ก่อน ถ้าไม่มีใช้จาก Warehouse
    const name =
      toStr(j["ชื่อสินค้า"]) ??
      toStr(w["ชื่อสินค้า"]) ??
      toStr(w["ชื่อย่อสินค้า"]) ??
      sku;

    records.push({
      sku,
      variant_code: toStr(j["รหัสรูปแบบ"]) ?? toStr(w["รหัสรูปแบบ"]),
      name,
      short_name: toStr(j["ชื่อย่อสินค้า"]) ?? toStr(w["ชื่อย่อสินค้า"]),
      image_url: toStr(j["รูปภาพ SKU"]) ?? toStr(w["รูปภาพ"]),
      category: toStr(j["หมวดหมู่"]),
      brand: toStr(j["แบรนด์"]),
      supplier: toStr(j["ชื่อผู้จําหน่าย"]),
      unit: toStr(j["หน่วย"]) ?? "ชิ้น",
      warehouse_name: toStr(w["ชื่อคลังสินค้า"]),

      // Stock levels — ใช้จาก warehouse เป็นหลัก
      quantity: toInt(w["สินค้าคงคลัง"]) || toInt(j["จำนวน"]),
      available_qty: toInt(w["จํานวนที่ใช้ได้"]) || toInt(j["จํานวนที่ใช้ได้"]),
      in_procurement: toInt(w["อยู่ระหว่างการจัดซื้อ"]) || toInt(j["อยู่ระหว่างการจัดซื้อ"]),
      locked_qty: toInt(w["จำนวนการล็อคสินค้า"]),
      damaged_qty: toInt(w["คลังสินค้าชำรุด"]),
      return_qty: toInt(w["คลังสินค้าคืน"]),
      incoming_qty: toInt(w["คลังสินค้าเข้า"]),

      // Thresholds จาก JST
      min_quantity: toInt(j["จำนวนน้อยสุดในการเติมสินค้า (MIN)"]) || 10,
      max_quantity: toInt(j["จำนวนสูงสุดในการเติมสินค้า (MAX)"]) || 100,

      // Sales
      sales_7d: toInt(w["ยอดขาย 7 วัน"]) || toInt(j["ยอดขาย 7 วัน"]),
      sales_30d: toInt(w["ยอดขาย 30 วัน"]) || toInt(j["ยอดขาย 30 วัน"]),

      // Pricing
      selling_price: toFloat(j["ราคาขาย"]),
      cost_price: toFloat(j["ราคาต้นทุน"]),
    });
  }

  return records;
}

// ============================================================
// Upsert ทีละ batch
// ============================================================
async function upsertBatch(records: ReturnType<typeof mergeData>, batchSize = 200) {
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error } = await supabase
      .from("products")
      .upsert(batch, { onConflict: "sku" });

    if (error) {
      console.error(`❌ Batch ${i}-${i + batchSize} error:`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`\r✅ Upserted ${inserted}/${records.length}`);
    }
  }

  console.log(`\n\n📊 สรุป: ${inserted} รายการ upserted, ${errors} errors`);
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log("🚀 เริ่ม import ข้อมูลจาก Excel ไปยัง Supabase...\n");

  const warehouseMap = readWarehouseInventory();
  const jstMap = readProductJST();
  const records = mergeData(warehouseMap, jstMap);

  console.log(`\n🔗 รวม unique SKU: ${records.length} รายการ`);
  console.log("📤 กำลัง upsert ไปยัง Supabase...\n");

  await upsertBatch(records);

  console.log("✅ Import เสร็จสมบูรณ์!");
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
