-- Add shipping address fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_address text null,
ADD COLUMN IF NOT EXISTS shipping_city text null,
ADD COLUMN IF NOT EXISTS shipping_state text null,
ADD COLUMN IF NOT EXISTS shipping_zip_code text null,
ADD COLUMN IF NOT EXISTS shipping_country text null,
ADD COLUMN IF NOT EXISTS shipping_phone text null;

-- Update the status check constraint to include 'pending_payment'
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (
  status = ANY (ARRAY['pending', 'pending_payment', 'completed', 'cancelled'])
);
