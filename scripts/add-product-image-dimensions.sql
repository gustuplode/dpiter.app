-- Add image aspect ratio columns to category_products table
ALTER TABLE category_products 
ADD COLUMN IF NOT EXISTS image_aspect_ratio TEXT DEFAULT '1:1 Square';

ALTER TABLE category_products 
ADD COLUMN IF NOT EXISTS image_width INTEGER DEFAULT 1080;

ALTER TABLE category_products 
ADD COLUMN IF NOT EXISTS image_height INTEGER DEFAULT 1080;

-- Update existing products to have default values
UPDATE category_products 
SET 
  image_aspect_ratio = '1:1 Square',
  image_width = 1080,
  image_height = 1080
WHERE image_aspect_ratio IS NULL;
