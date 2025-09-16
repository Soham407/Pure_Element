const { supabaseAdmin } = require('../config/supabase');

// POST /api/v1/orders - Create new order
async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { items, shipping_address, shipping_city, shipping_state, shipping_zip_code, shipping_country, shipping_phone } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    if (!shipping_address || !shipping_city || !shipping_state || !shipping_zip_code || !shipping_phone) {
      return res.status(400).json({ error: 'All shipping information is required' });
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (parseFloat(item.price_at_purchase) * item.quantity);
    }, 0);

    // Create order with shipping information
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending_payment',
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_zip_code,
        shipping_country: shipping_country || 'India',
        shipping_phone
      })
      .select('*')
      .single();

    if (orderError) {
      console.error('createOrder error:', orderError);
      return res.status(500).json({ error: 'Failed to create order' });
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('createOrderItems error:', itemsError);
      // If order items creation fails, we should delete the order
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return res.status(500).json({ error: 'Failed to create order items' });
    }

    // Clear user's cart after successful order creation
    const { error: clearCartError } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .in('cart_id', (await supabaseAdmin
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single()
      ).data.id);

    if (clearCartError) {
      console.error('clearCart error:', clearCartError);
      // Don't fail the order creation if cart clearing fails
    }

    return res.status(201).json({ 
      message: 'Order created successfully', 
      order: {
        id: order.id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at
      }
    });

  } catch (err) {
    console.error('createOrder unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/v1/orders/my
async function getMyOrders(req, res) {
  try {
    const userId = req.user.id;

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        status,
        created_at,
        order_items (
          id,
          product_id,
          quantity,
          price_at_purchase,
          products (
            id,
            name,
            thumbnail_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getMyOrders error:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    return res.json({ orders: orders || [] });
  } catch (err) {
    console.error('getMyOrders unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/v1/orders/all (admin only)
async function getAllOrders(req, res) {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        user_id,
        total_amount,
        status,
        created_at,
        users (
          id,
          email
        ),
        order_items (
          id,
          product_id,
          quantity,
          price_at_purchase,
          products (
            id,
            name,
            thumbnail_url
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getAllOrders error:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    return res.json({ orders: orders || [] });
  } catch (err) {
    console.error('getAllOrders unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// PATCH /api/v1/orders/:orderId/status (admin only)
async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(String(status).toLowerCase())) {
      return res.status(400).json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    const { data: existing, error: getErr } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .single();

    if (getErr || !existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('orders')
      .update({ status: String(status).toLowerCase() })
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      console.error('updateOrderStatus error:', error);
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    return res.json({ message: 'Order status updated successfully', order: updated });
  } catch (err) {
    console.error('updateOrderStatus unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};


