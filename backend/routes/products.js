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

// Get products by category (supports parent with children)
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 24, 1), 100);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 1) Check category exists
    const { data: category, error: categoryError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .single();
    if (categoryError) {
      if (categoryError.code === 'PGRST116' || categoryError.details?.includes('No rows found')) {
        return res.status(404).json({ error: 'Category not found' });
      }
      console.error('Check category error:', categoryError);
      return res.status(500).json({ error: 'Failed to fetch category' });
    }

    // 2) Find children of this category
    const { data: children, error: childrenError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('parent_id', categoryId);
    if (childrenError) {
      console.error('Fetch child categories error:', childrenError);
      return res.status(500).json({ error: 'Failed to fetch child categories' });
    }

    const isParent = Array.isArray(children) && children.length > 0;
    const categoryIds = isParent ? children.map(c => c.id) : [categoryId];

    // 3) Fetch products for the relevant category IDs with range for pagination
    const { data: products, error: productsError, count } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `, { count: 'exact' })
      .in('category_id', categoryIds)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (productsError) {
      console.error('Get products by category error:', productsError);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    res.json({ products: products || [], total: count || 0, page, limit, categoryId, isParent });
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
