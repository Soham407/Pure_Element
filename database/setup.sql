-- Pure_element E-commerce Database Setup
-- This script creates all necessary tables, policies, and initial data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    category_id UUID REFERENCES categories(id) NOT NULL,
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES carts(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(cart_id, product_id)
);

-- Create orders table (for future expansion)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create order_items table (for future expansion)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC(10, 2) NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can register" ON users
    FOR INSERT WITH CHECK (true);

-- Create RLS policies for categories table
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

-- Create RLS policies for products table
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

-- Create RLS policies for carts table
CREATE POLICY "Users can manage their own cart" ON carts
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for cart_items table
CREATE POLICY "Users can manage their own cart items" ON cart_items
    FOR ALL USING (
        auth.uid() = (SELECT user_id FROM carts WHERE id = cart_id)
    );

-- Create RLS policies for orders table
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for order_items table
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        auth.uid() = (SELECT user_id FROM orders WHERE id = order_id)
    );

-- Insert default categories
INSERT INTO categories (name) VALUES 
    ('Hair Care'),
    ('Skin Care'),
    ('Body Care'),
    ('Wellness'),
    ('Gifting')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products (you can modify or remove these)
DO $$
DECLARE
    hair_care_id UUID;
    skin_care_id UUID;
    body_care_id UUID;
    wellness_id UUID;
    gifting_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO hair_care_id FROM categories WHERE name = 'Hair Care';
    SELECT id INTO skin_care_id FROM categories WHERE name = 'Skin Care';
    SELECT id INTO body_care_id FROM categories WHERE name = 'Body Care';
    SELECT id INTO wellness_id FROM categories WHERE name = 'Wellness';
    SELECT id INTO gifting_id FROM categories WHERE name = 'Gifting';

    -- Insert sample products
    INSERT INTO products (name, description, price, category_id, stock) VALUES
        ('Ayurvedic Hair Oil', 'Nourishing hair oil with natural herbs for healthy, strong hair', 24.99, hair_care_id, 50),
        ('Herbal Shampoo', 'Gentle cleansing shampoo with ayurvedic ingredients', 18.99, hair_care_id, 75),
        ('Natural Face Cream', 'Moisturizing face cream with turmeric and neem', 32.99, skin_care_id, 40),
        ('Ayurvedic Face Wash', 'Deep cleansing face wash with natural extracts', 16.99, skin_care_id, 60),
        ('Body Massage Oil', 'Relaxing massage oil with essential herbs', 28.99, body_care_id, 35),
        ('Herbal Body Scrub', 'Exfoliating body scrub with natural ingredients', 22.99, body_care_id, 45),
        ('Wellness Tea Blend', 'Immunity boosting herbal tea blend', 14.99, wellness_id, 100),
        ('Ayurvedic Supplements', 'Daily wellness supplements with natural herbs', 39.99, wellness_id, 80),
        ('Gift Set - Hair Care', 'Complete hair care gift set with oil and shampoo', 49.99, gifting_id, 25),
        ('Wellness Gift Box', 'Curated wellness products in a beautiful gift box', 79.99, gifting_id, 20)
    ON CONFLICT DO NOTHING;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for product images (this needs to be done via Supabase dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

COMMENT ON TABLE users IS 'User accounts and authentication information';
COMMENT ON TABLE categories IS 'Product categories for organizing products';
COMMENT ON TABLE products IS 'Product catalog with details and pricing';
COMMENT ON TABLE carts IS 'User shopping carts';
COMMENT ON TABLE cart_items IS 'Items in user shopping carts';
COMMENT ON TABLE orders IS 'Customer orders (for future expansion)';
COMMENT ON TABLE order_items IS 'Line items for customer orders (for future expansion)';

-- Grant necessary permissions (adjust as needed)
-- GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
