# Import Excel Command

นำเข้าข้อมูลจาก Excel ไปยัง Supabase

## วิธีใช้

```
/import-excel
```

## สิ่งที่ Claude จะทำ

1. ตรวจสอบว่าไฟล์ Excel มีอยู่:
   - `warehouseInventory.xlsx`
   - `Product JST.xlsx`

2. ตรวจสอบ `.env.local` มี `SUPABASE_SERVICE_ROLE_KEY`

3. รัน import script:
```bash
npx ts-node --project tsconfig.scripts.json scripts/import-excel.ts
```

4. รายงานผล: จำนวน rows ที่ upserted, errors (ถ้ามี)

5. ตรวจสอบใน Supabase ว่าข้อมูลเข้าถูกต้อง:
```sql
SELECT COUNT(*) FROM products;
SELECT * FROM products WHERE available_qty <= min_quantity LIMIT 10;
```

## หมายเหตุ
- Script ใช้ `upsert` (ไม่ duplicate) — สามารถรันซ้ำได้
- ต้องมี `SUPABASE_SERVICE_ROLE_KEY` (ไม่ใช่ anon key)
- ข้อมูลจาก `Product JST.xlsx` จะ override ชื่อสินค้าจาก `warehouseInventory.xlsx`
