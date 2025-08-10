const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get cart with items
    const { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select(`
        id,
        cart_items (
          id,
          quantity,
          products (
            id,
            name,
            price,
            image_url,
            stock
          )
        )
      `)
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) {
      console.error('Get cart error:', cartError);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }

    if (!cart) {
      return res.json({ cart: { id: null, cart_items: [], total: 0 } });
    }

    // Calculate total
      
      

    // Calculate total
    const total = (cart.cart_items || []).reduce((sum, item) => {
      return sum + (item.products.price * item.quantity);
    }, 0);

    res.json({ 
      cart: {
        ...cart,
        total: parseFloat(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists and has stock
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, stock')
      .eq('id', productId)
      .maybeSingle();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Get user's cart or create one if it doesn't exist
    let { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) {
      console.error('Get cart error:', cartError);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }

    // Create cart if it doesn't exist
    if (!cart) {
      const { data: newCart, error: createError } = await supabaseAdmin
        .from('carts')
        .insert([{ user_id: userId }])
        .select('id')
        .single();

      if (createError) {
        console.error('Create cart error:', createError);
        return res.status(500).json({ error: 'Failed to create cart' });
      }
      cart = newCart;
    }

    // Check if item already exists in cart
    const { data: existingItem, error: existingError } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock for requested quantity' });
      }

      const { error: updateError } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);

      if (updateError) {
        console.error('Update cart item error:', updateError);
        return res.status(500).json({ error: 'Failed to update cart item' });
      }
    } else {
      // Add new item
      const { error: insertError } = await supabaseAdmin
        .from('cart_items')
        .insert([{
          cart_id: cart.id,
          product_id: productId,
          quantity
        }]);

      if (insertError) {
        console.error('Add cart item error:', insertError);
        return res.status(500).json({ error: 'Failed to add item to cart' });
      }
    }

    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item quantity
router.put('/update/:itemId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    // Verify item belongs to user's cart
    const { data: cartItem, error: itemError } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
        quantity,
        products (id, stock),
        carts!inner (user_id)
      `)
      .eq('id', itemId)
      .eq('carts.user_id', userId)
      .maybeSingle();

    if (itemError || !cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (cartItem.products.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update quantity
    const { error: updateError } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (updateError) {
      console.error('Update cart item error:', updateError);
      return res.status(500).json({ error: 'Failed to update cart item' });
    }

    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    // Verify item belongs to user's cart and delete
    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('cart_id', (
        await supabaseAdmin
          .from('carts')
          .select('id')
          .eq('user_id', userId)
          .single()
      ).data.id);

    if (error) {
      console.error('Remove cart item error:', error);
      return res.status(500).json({ error: 'Failed to remove cart item' });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart or create one if it doesn't exist
    let { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) {
      console.error('Get cart error:', cartError);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }

    // Create cart if it doesn't exist
    if (!cart) {
      const { data: newCart, error: createError } = await supabaseAdmin
        .from('carts')
        .insert([{ user_id: userId }])
        .select('id')
        .single();

      if (createError) {
        console.error('Create cart error:', createError);
        return res.status(500).json({ error: 'Failed to create cart' });
      }
      cart = newCart;
    }

    // Delete all cart items
    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (error) {
      console.error('Clear cart error:', error);
      return res.status(500).json({ error: 'Failed to clear cart' });
    }

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
