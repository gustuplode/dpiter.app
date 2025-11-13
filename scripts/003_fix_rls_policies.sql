-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view published collections" ON public.collections;
DROP POLICY IF EXISTS "Authenticated users can insert collections" ON public.collections;
DROP POLICY IF EXISTS "Authenticated users can update collections" ON public.collections;
DROP POLICY IF EXISTS "Authenticated users can delete collections" ON public.collections;

DROP POLICY IF EXISTS "Anyone can view visible products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

-- Create new policies that allow public read and authenticated write
-- Collections policies
CREATE POLICY "Public can view published collections" 
  ON public.collections FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Authenticated can view all collections" 
  ON public.collections FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert collections" 
  ON public.collections FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update collections" 
  ON public.collections FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete collections" 
  ON public.collections FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Products policies
CREATE POLICY "Public can view visible products" 
  ON public.products FOR SELECT 
  USING (is_visible = true);

CREATE POLICY "Authenticated can view all products" 
  ON public.products FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert products" 
  ON public.products FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update products" 
  ON public.products FOR UPDATE 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete products" 
  ON public.products FOR DELETE 
  USING (auth.role() = 'authenticated');
