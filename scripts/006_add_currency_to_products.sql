-- Add currency column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Update RLS policies if needed (they should already cover this new column)
