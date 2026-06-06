# Generate Migration Command

สร้าง SQL migration file ใหม่

## วิธีใช้

```
/generate-migration add-supplier-table
```

## สิ่งที่ Claude จะทำ

1. สร้างไฟล์ migration ในรูปแบบ:
   `supabase/migrations/NNN_<description>.sql`
   (NNN = เลขลำดับถัดไปจากที่มีอยู่)

2. เขียน SQL ตาม best practices:
   - ใช้ `CREATE TABLE IF NOT EXISTS`
   - เพิ่ม indexes ที่จำเป็น
   - เปิด RLS และสร้าง policies
   - เพิ่ม `updated_at` trigger

3. Apply migration ผ่าน Supabase MCP:
   ```
   supabase.apply_migration(migration_sql)
   ```

4. Verify ด้วย `list_tables`

## ตัวอย่าง Migrations
- `002_add_supplier_column.sql` — เพิ่ม column
- `003_create_movements_table.sql` — สร้าง table ใหม่
- `004_add_index_sku.sql` — เพิ่ม index
