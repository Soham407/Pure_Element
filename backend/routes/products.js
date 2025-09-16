const express = require('express');
const { supabaseAdmin } = require('../config/supabase');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get products error:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get products by category error:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    res.json({ products });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        stock,
        thumbnail_url,
        categories (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product gallery images (public endpoint) - must come before /:id route
router.get('/:id/images', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: images, error } = await supabaseAdmin
      .from('product_images')
      .select('id, image_url, created_at')
      .eq('product_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Get product images error:', error);
      return res.status(500).json({ error: 'Failed to fetch product images' });
    }

    res.json({ images });
  } catch (error) {
    console.error('Get product images error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Search products error:', error);
      return res.status(500).json({ error: 'Failed to search products' });
    }

    res.json({ products });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
