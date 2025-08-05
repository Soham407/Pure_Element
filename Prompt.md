Pure_element E-commerce Application Prompt (Ayurvedic Products)
This document outlines the requirements for building a full-stack e-commerce website for Ayurvedic beauty and wellness products, named "Pure_element", using React for the frontend, Node.js with Express for the backend, and Supabase for the database and storage.
1. Project Overview

The goal is to create a dynamic e-commerce platform that allows customers to browse Ayurvedic beauty and wellness products, manage a shopping cart, and view their profiles. An administrative interface will enable product management, including creation, editing, and image uploads.
2. Frontend Requirements (React)
The React application will be the user-facing interface, providing a seamless browsing and shopping experience.
2.1. Core Pages
Landing Page (/):
A visually appealing hero section with a call to action.
Display of featured or popular products.
Navigation links to the product page and other relevant sections.
Product Listing Page (/products):
Display all available Ayurvedic beauty and wellness products in a grid or list format.
Each product card should include:
Product Image
Product Name
Price
Short Description
"Add to Cart" button
Category Filtering:
The header/navigation bar will contain category titles (e.g., "Hair Care", "Skin Care", "Body Care", "Wellness", "Gifting").
Clicking a category title should filter the displayed products to show only those belonging to the selected category.
Product Detail Page (/products/:id): (Implicitly requested by "edit all info about the product" for admin, good for customers too)
Detailed view of a single product with a larger image, full description, price, stock status, and an "Add to Cart" button.
Shopping Cart Page (/cart):
Display all items currently in the user's shopping cart.
For each item: product image, name, quantity, price, and subtotal.
Options to adjust item quantity or remove items from the cart.
Display the total cart value.
A "Proceed to Checkout" button (functionality can be simplified, focusing on UI for now).
User Profile Page (/profile):
Accessible to logged-in customers.
Display user's email and other relevant profile information.
Option to update profile details.
(Optional but recommended) View past orders.
Authentication Pages (/login, /register):
Forms for user registration and login.
Clear error messages for invalid credentials or registration issues.
2.2. Admin Dashboard (/admin/dashboard)
Access Control: This section should only be accessible to users with the admin role.
Product Management:
A table or list displaying all products with options to "Edit" or "Delete" each product.
Edit Product: A form pre-populated with existing product details (name, description, price, category, stock, current image).
Ability to update any of these fields.
Option to upload a new image from the local computer, which will replace the existing one in Supabase storage.
Create New Product: A form with input fields for all product details (name, description, price, category, stock).
Mandatory image upload from the local computer.
2.3. General Frontend Features
Responsive Design: The entire application must be fully responsive and look good on various screen sizes (mobile, tablet, desktop).
Loading States & Error Handling: Implement clear loading indicators and user-friendly error messages for API calls.
State Management: Use React Context API or a similar lightweight state management solution for global states like user authentication status, cart items, etc.
3. Backend Requirements (Node.js & Express)
The Express backend will act as an API layer between the React frontend and Supabase, handling business logic and data interactions.
3.1. API Endpoints
Authentication:
POST /api/auth/register: Register a new user (customer or admin).
POST /api/auth/login: Authenticate a user and return a token (e.g., JWT).
GET /api/auth/me: Get current user's profile based on token.
Products:
GET /api/products: Get all products.
GET /api/products/category/:categoryId: Get products by category.
GET /api/products/:id: Get a single product by ID.
POST /api/admin/products: Create a new product (Admin only).
PUT /api/admin/products/:id: Update an existing product (Admin only).
DELETE /api/admin/products/:id: Delete a product (Admin only).
Categories:
GET /api/categories: Get all categories.
POST /api/admin/categories: Create a new category (Admin only).
Cart:
GET /api/cart: Get the current user's cart.
POST /api/cart/add: Add a product to the cart.
PUT /api/cart/update/:itemId: Update quantity of an item in the cart.
DELETE /api/cart/remove/:itemId: Remove an item from the cart.
User Profile:
PUT /api/profile: Update current user's profile.
Image Upload:
POST /api/admin/upload-image: Endpoint for uploading product images to Supabase storage (Admin only). This endpoint should handle receiving the image file and interacting with the Supabase storage client.
3.2. Middleware & Security
Authentication Middleware: Protect routes that require a logged-in user or admin privileges. Verify JWT tokens.
Error Handling: Implement robust error handling for API routes.
CORS: Configure CORS to allow requests from the React frontend.
4. Supabase Integration (Database & Storage)
The "Pure_element" Supabase project will serve as the backend database and file storage.
4.1. Database Schema
Create the following tables with appropriate primary keys (PK), foreign keys (FK), and data types. Use UUIDs for IDs where possible.
users Table:
id (UUID, PK, default gen_random_uuid())
email (TEXT, UNIQUE, NOT NULL)
password_hash (TEXT, NOT NULL) - Store hashed passwords, not plain text.
role (TEXT, NOT NULL, default 'customer', CHECK (role IN ('customer', 'admin')))
created_at (TIMESTAMPTZ, default now())
updated_at (TIMESTAMPTZ, default now())
categories Table:
id (UUID, PK, default gen_random_uuid())
name (TEXT, UNIQUE, NOT NULL)
created_at (TIMESTAMPTZ, default now())
products Table:
id (UUID, PK, default gen_random_uuid())
name (TEXT, NOT NULL)
description (TEXT)
price (NUMERIC(10, 2), NOT NULL, CHECK (price > 0))
category_id (UUID, FK to categories.id, NOT NULL)
image_url (TEXT) - URL to the image in Supabase storage.
stock (INTEGER, NOT NULL, default 0, CHECK (stock >= 0))
created_at (TIMESTAMPTZ, default now())
updated_at (TIMESTAMPTZ, default now())
carts Table:
id (UUID, PK, default gen_random_uuid())
user_id (UUID, FK to users.id, UNIQUE, NOT NULL) - One cart per user.
created_at (TIMESTRAWTZ, default now())
updated_at (TIMESTAMPTZ, default now())
cart_items Table:
id (UUID, PK, default gen_random_uuid())
cart_id (UUID, FK to carts.id, NOT NULL)
product_id (UUID, FK to products.id, NOT NULL)
quantity (INTEGER, NOT NULL, default 1, CHECK (quantity > 0))
created_at (TIMESTAMPTZ, default now())
UNIQUE(cart_id, product_id) - Ensure only one entry per product per cart.
orders Table: (Recommended for future expansion)
id (UUID, PK, default gen_random_uuid())
user_id (UUID, FK to users.id, NOT NULL)
total_amount (NUMERIC(10, 2), NOT NULL)
status (TEXT, NOT NULL, default 'pending', CHECK (status IN ('pending', 'completed', 'cancelled')))
created_at (TIMESTAMPTZ, default now())
order_items Table: (Recommended for future expansion)
id (UUID, PK, default gen_random_uuid())
order_id (UUID, FK to orders.id, NOT NULL)
product_id (UUID, FK to products.id, NOT NULL)
quantity (INTEGER, NOT NULL)
price_at_purchase (NUMERIC(10, 2), NOT NULL) - Price when the order was placed.
4.2. Row Level Security (RLS) Policies
Enable RLS for all tables and create policies as follows:
users Table:
SELECT:
Policy: Allow authenticated users to view their own profile.
Expression: auth.uid() = id
Policy: Allow admin to view all user profiles.
Expression: auth.role() = 'admin' (assuming auth.role() can be used after setting up custom claims or a specific RLS function to check roles)
INSERT:
Policy: Allow any user to register.
Expression: true
UPDATE:
Policy: Allow users to update their own profile.
Expression: auth.uid() = id
Policy: Allow admin to update any user profile.
Expression: auth.role() = 'admin'
DELETE:
Policy: Allow admin to delete any user.
Expression: auth.role() = 'admin'
categories Table:
SELECT: Allow all users to view categories.
Expression: true
INSERT, UPDATE, DELETE: Allow only admin to manage categories.
Expression: auth.role() = 'admin'
products Table:
SELECT: Allow all users to view products.
Expression: true
INSERT, UPDATE, DELETE: Allow only admin to manage products.
Expression: auth.role() = 'admin'
carts & cart_items Tables:
SELECT, INSERT, UPDATE, DELETE: Allow users to manage their own carts/cart items.
Expression: auth.uid() = user_id (for carts)
Expression: auth.uid() = (SELECT user_id FROM carts WHERE id = cart_id) (for cart_items)
4.3. Storage Bucket
Bucket Name: product_images
Policies for product_images Bucket:
SELECT: Allow public read access to product images.
Target: objects
Operation: SELECT
Policy: true
INSERT: Allow only authenticated admin users to upload images.
Target: objects
Operation: INSERT
Policy: auth.role() = 'admin'
UPDATE, DELETE: Allow only authenticated admin users to update/delete images.
Target: objects
Operation: UPDATE, DELETE
Policy: auth.role() = 'admin'
5. Environment Variables
Create a .env file in both your React frontend and Node.js backend directories.
Frontend (.env in React project root):
REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY


Backend (.env in Node.js project root):
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY # For admin operations that bypass RLS (e.g., creating admin users, or if RLS is too complex for initial setup)
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY # Can also be used for public reads
JWT_SECRET=YOUR_RANDOM_SECRET_KEY # For signing/verifying JWTs

You will manually add your Supabase URL and API keys to these files.
6. Deployment Considerations (Brief)
The React app will be served statically.
The Node.js/Express app will run as a server.
Consider using a service like Vercel/Netlify for frontend and Render/Heroku for backend, or a single platform like Railway for both.
7. Additional Notes
Password Hashing: Ensure passwords are securely hashed (e.g., using bcrypt) before storing them in the users table.
Admin User Creation: Provide initial instructions or a simple script/route to create the first admin user directly in Supabase or via a protected backend endpoint.
Error Handling: Implement comprehensive error handling on both frontend and backend to provide a robust user experience.
Image Uploads: The backend should handle receiving the image file from the frontend, uploading it to the product_images bucket in Supabase storage, and then storing the returned public URL in the image_url column of the products table. When updating a product image, ensure the old image is deleted from storage to prevent orphaned files.
This comprehensive prompt should guide the development of your Pure_element e-commerce application.
