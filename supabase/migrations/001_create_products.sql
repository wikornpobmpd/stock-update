-- Migration: 001_create_products.sql
-- Stock Update Website — สร้าง products table

CREATE TABLE IF NOT EXISTS products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku             text UNIQUE NOT NULL,
  variant_code    text,
  name            text NOT NULL,
  short_name      text,
  image_url       text,
  category        text,
  brand           text,
  supplier        text,
  unit            text DEFAULT 'ชิ้น',
  warehouse_name  text,

  -- Stock levels (จาก warehouseInventory.xlsx)
  quantity        integer NOT NULL DEFAULT 0,
  available_qty   integer NOT NULL DEFAULT 0,
  in_procurement  integer DEFAULT 0,
  locked_qty      integer DEFAULT 0,
  damaged_qty     integer DEFAULT 0,
  return_qty      integer DEFAULT 0,
  incoming_qty    integer DEFAULT 0,

  -- Alert thresholds (จาก Product JST.xlsx: MIN/MAX)
  min_quantity    integer DEFAULT 10,
  max_quantity    integer DEFAULT 100,

  -- Sales velocity
  sales_7d        integer DEFAULT 0,
  sales_30d       integer DEFAULT 0,

  -- Pricing
  selling_price   numeric(10,2),
  cost_price      numeric(10,2),

  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Enable Realtime for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Indexes สำหรับ performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_warehouse ON products(warehouse_name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_low_stock ON products(available_qty, min_quantity);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (เปิดสำหรับ public read ใน Phase 1)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  USING (true);
