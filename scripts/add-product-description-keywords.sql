-- Add description and keywords columns to category_products table
-- Run this script to add new columns for SEO

-- Add description column
ALTER TABLE category_products 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add keywords column
ALTER TABLE category_products 
ADD COLUMN IF NOT EXISTS keywords TEXT;

-- Add comment for documentation
COMMENT ON COLUMN category_products.description IS 'Product description shown on product details page';
COMMENT ON COLUMN category_products.keywords IS 'Comma-separated keywords for SEO, shown on product details page';
