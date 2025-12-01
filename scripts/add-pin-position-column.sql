-- Add pin_position column to category_products table
ALTER TABLE category_products 
ADD COLUMN IF NOT EXISTS pin_position INTEGER DEFAULT NULL;

-- Create index for faster ordering by pin position
CREATE INDEX IF NOT EXISTS idx_category_products_pin_position 
ON category_products(pin_position NULLS LAST);

-- Update existing products to have null pin_position
UPDATE category_products SET pin_position = NULL WHERE pin_position IS NULL;
