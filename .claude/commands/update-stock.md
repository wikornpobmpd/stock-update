# Update Stock Command

อัพเดทจำนวนสต็อกของสินค้า

## วิธีใช้

```
/update-stock SKU001 quantity=25
```

หรือบอก Claude เช่น:
```
/update-stock — อัพเดทสต็อก FFDHOTCT01-PT-BL เป็น 15 ชิ้น
```

## สิ่งที่ Claude จะทำ

1. ค้นหาสินค้าด้วย SKU
2. แสดงข้อมูลปัจจุบัน (available_qty, min_quantity)
3. ยืนยันการอัพเดท
4. ใช้ Supabase MCP `execute_sql`:
```sql
UPDATE products
SET available_qty = $new_qty,
    quantity = $new_qty
WHERE sku = '$sku';
```
5. ตรวจสอบว่า alert threshold ถูก trigger หรือไม่

## Fields ที่อัพเดทได้
- `quantity` — จำนวนคงคลังรวม
- `available_qty` — จำนวนที่ใช้ได้จริง
- `min_quantity` — ปรับ threshold แจ้งเตือน
- `in_procurement` — จำนวนที่กำลังจัดซื้อ
