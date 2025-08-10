# Checkout Implementation

This document describes the checkout flow implementation for the e-commerce website.

## Overview

The checkout system allows users to:
1. Review their cart items
2. Enter shipping information
3. Create an order with "Pending Payment" status
4. Clear their cart after successful order creation

## Database Changes

### Orders Table Updates
Added shipping address fields to the `orders` table:
- `shipping_address` (text)
- `shipping_city` (text)
- `shipping_state` (text)
- `shipping_zip_code` (text)
- `shipping_country` (text)
- `shipping_phone` (text)

Updated the status constraint to include `'pending_payment'` status.

## Backend Implementation

### New API Endpoint
- `POST /api/v1/orders` - Create a new order

### Order Controller (`backend/controllers/orderController.js`)
- `createOrder()` - Creates a new order with shipping information
- Validates required fields
- Calculates total amount
- Creates order items
- Clears user's cart after successful order creation
- Returns order details

### Order Routes (`backend/routes/orderRoutes.js`)
- Added POST route for order creation
- Requires authentication

## Frontend Implementation

### New Page
- `frontend/src/pages/Checkout.jsx` - Checkout page with shipping form and order summary

### Features
- Shipping address form with validation
- Order summary with item details and pricing
- Payment placeholder section
- Form validation for required fields
- Integration with cart context
- Automatic cart clearing after order creation

### Updated Files
- `frontend/src/App.js` - Added checkout route
- `frontend/src/pages/Cart.js` - Updated "Proceed to Checkout" button to link to checkout page

## User Flow

1. User adds items to cart
2. User clicks "Proceed to Checkout" from cart page
3. User fills out shipping information
4. User clicks "Proceed to Payment"
5. Order is created with "Pending Payment" status
6. User's cart is cleared
7. User is redirected to profile page (where they can view orders)

## Payment Integration

The payment step is currently a placeholder. In a real implementation, you would:
1. Integrate with a payment gateway (Stripe, PayPal, etc.)
2. Process payment before creating the order
3. Update order status based on payment result
4. Handle payment failures and retries

## Security Features

- All endpoints require authentication
- Form validation on both frontend and backend
- SQL injection protection through Supabase
- Input sanitization and validation

## Testing

To test the checkout flow:
1. Add items to cart
2. Navigate to checkout page
3. Fill out shipping information
4. Submit order
5. Verify order is created in database
6. Verify cart is cleared
7. Check order status is "pending_payment"

## Future Enhancements

- Payment gateway integration
- Order confirmation emails
- Inventory management
- Shipping cost calculation
- Tax calculation based on location
- Order tracking
- Return/refund functionality
