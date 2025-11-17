-- Create category_products table for Fashion, Gadgets, Gaming
CREATE TABLE IF NOT EXISTS category_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fashion', 'gadgets', 'gaming')),
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  slug TEXT
);

-- Enable RLS
ALTER TABLE category_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view visible category products" ON category_products
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Authenticated can view all category products" ON category_products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert category products" ON category_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update category products" ON category_products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete category products" ON category_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS category_products_category_idx ON category_products(category);
CREATE INDEX IF NOT EXISTS category_products_visible_idx ON category_products(is_visible);
