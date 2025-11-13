-- Create admin users table (separate from auth.users for admin-only access)
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create collections table
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('published', 'draft')) DEFAULT 'draft',
  product_count INTEGER DEFAULT 0,
  is_limited_time BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  affiliate_link TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user wishlist table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins table (admin only can see their own data)
CREATE POLICY "Admins can view their own data" 
  ON public.admins FOR SELECT 
  USING (auth.uid() = id);

-- Allow public read for published, any authenticated user can manage collections
DROP POLICY IF EXISTS "Anyone can view published collections" ON public.collections;
CREATE POLICY "Anyone can view published collections" 
  ON public.collections FOR SELECT 
  USING (status = 'published' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can insert collections" ON public.collections;
CREATE POLICY "Authenticated users can insert collections" 
  ON public.collections FOR INSERT 
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update collections" ON public.collections;
CREATE POLICY "Authenticated users can update collections" 
  ON public.collections FOR UPDATE 
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can delete collections" ON public.collections;
CREATE POLICY "Authenticated users can delete collections" 
  ON public.collections FOR DELETE 
  TO authenticated
  USING (true);

-- Allow public read for visible products, any authenticated user can manage products
DROP POLICY IF EXISTS "Anyone can view visible products" ON public.products;
CREATE POLICY "Anyone can view visible products" 
  ON public.products FOR SELECT 
  USING (is_visible = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Authenticated users can insert products" 
  ON public.products FOR INSERT 
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Authenticated users can update products" 
  ON public.products FOR UPDATE 
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Authenticated users can delete products" 
  ON public.products FOR DELETE 
  TO authenticated
  USING (true);

-- RLS Policies for wishlists (users can only see/manage their own)
CREATE POLICY "Users can view their own wishlist" 
  ON public.wishlists FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their wishlist" 
  ON public.wishlists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their wishlist" 
  ON public.wishlists FOR DELETE 
  USING (auth.uid() = user_id);

-- Function to update product count in collections
CREATE OR REPLACE FUNCTION update_collection_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.collections 
    SET product_count = product_count + 1 
    WHERE id = NEW.collection_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.collections 
    SET product_count = product_count - 1 
    WHERE id = OLD.collection_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update product count
CREATE TRIGGER update_product_count_trigger
AFTER INSERT OR DELETE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_collection_product_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
