-- Add slug columns to collections and products tables
ALTER TABLE public.collections 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(text_input, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to auto-generate slug on insert/update for collections
CREATE OR REPLACE FUNCTION auto_generate_collection_slug()
RETURNS TRIGGER AS $$
DECLARE
  new_slug TEXT;
  slug_count INTEGER;
BEGIN
  -- Generate base slug from title
  new_slug := generate_slug(NEW.title);
  
  -- Check if slug exists and add number if needed
  slug_count := 0;
  LOOP
    IF slug_count = 0 THEN
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.collections WHERE slug = new_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid));
    ELSE
      new_slug := generate_slug(NEW.title) || '-' || slug_count;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.collections WHERE slug = new_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid));
    END IF;
    slug_count := slug_count + 1;
  END LOOP;
  
  NEW.slug := new_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate slug on insert/update for products
CREATE OR REPLACE FUNCTION auto_generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := generate_slug(NEW.title);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-generating slugs
DROP TRIGGER IF EXISTS collection_slug_trigger ON public.collections;
CREATE TRIGGER collection_slug_trigger
BEFORE INSERT OR UPDATE OF title ON public.collections
FOR EACH ROW
EXECUTE FUNCTION auto_generate_collection_slug();

DROP TRIGGER IF EXISTS product_slug_trigger ON public.products;
CREATE TRIGGER product_slug_trigger
BEFORE INSERT OR UPDATE OF title ON public.products
FOR EACH ROW
EXECUTE FUNCTION auto_generate_product_slug();

-- Update existing records to have slugs
UPDATE public.collections SET slug = generate_slug(title) WHERE slug IS NULL;
UPDATE public.products SET slug = generate_slug(title) WHERE slug IS NULL;
