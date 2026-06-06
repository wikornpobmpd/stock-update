# Add Product Command

เพิ่มสินค้าใหม่เข้าไปใน Supabase `products` table

## วิธีใช้

บอก Claude:
```
/add-product
```

## สิ่งที่ Claude จะทำ

1. ถามข้อมูลสินค้าที่ต้องการ:
   - `sku` (รหัสสินค้า) — **จำเป็น**
   - `name` (ชื่อสินค้า) — **จำเป็น**
   - `warehouse_name` (ชื่อคลัง)
   - `quantity` และ `available_qty`
   - `min_quantity` (threshold แจ้งเตือน)
   - `category`, `brand`, `supplier`
   - `selling_price`, `cost_price`

2. ใช้ Supabase MCP `execute_sql` เพื่อ insert:
```sql
INSERT INTO products (sku, name, warehouse_name, quantity, available_qty, min_quantity, ...)
VALUES ('SKU001', 'ชื่อสินค้า', 'คลัง A', 50, 50, 10, ...)
ON CONFLICT (sku) DO UPDATE SET ...;
```

3. ยืนยันว่า insert สำเร็จ

## หมายเหตุ
- ต้องมี Supabase MCP connected
- SKU ต้องไม่ซ้ำกัน
