const express = require('express');
const { supabaseAdmin } = require('../config/supabase');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Get categories error:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get category with product count
router.get('/with-counts', async (req, res) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select(`
        *,
        products (count)
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('Get categories with counts error:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    res.json({ categories });
  } catch (error) {
    console.error('Get categories with counts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
