const express = require('express');
const multer = require('multer');
const { supabaseAdmin } = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Apply authentication and admin check to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Upload image to Supabase storage
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload to Supabase storage
    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Image upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName);

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: publicUrlData.publicUrl,
      fileName: fileName
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new product
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, categoryId, stock, imageUrl } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    if (stock < 0) {
      return res.status(400).json({ error: 'Stock cannot be negative' });
    }

    // Verify category exists
    const { data: category, error: categoryError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('id', categoryId)
      .single();

    if (categoryError || !category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Create product
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([{
        name,
        description,
        price: parseFloat(price),
        category_id: categoryId,
        stock: parseInt(stock) || 0,
        image_url: imageUrl
      }])
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('Create product error:', error);
      return res.status(500).json({ error: 'Failed to create product' });
    }

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, stock, imageUrl } = req.body;

    // Get existing product
    const { data: existingProduct, error: existingError } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (existingError || !existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      if (price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
      }
      updateData.price = parseFloat(price);
    }
    if (stock !== undefined) {
      if (stock < 0) {
        return res.status(400).json({ error: 'Stock cannot be negative' });
      }
      updateData.stock = parseInt(stock);
    }
    if (imageUrl !== undefined) updateData.image_url = imageUrl;

    if (categoryId !== undefined) {
      // Verify category exists
      const { data: category, error: categoryError } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('id', categoryId)
        .single();

      if (categoryError || !category) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      updateData.category_id = categoryId;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateData.updated_at = new Date().toISOString();

    // Update product
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .single();

    if (error) {
      console.error('Update product error:', error);
      return res.status(500).json({ error: 'Failed to update product' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get product to check if it has an image
    const { data: product, error: getError } = await supabaseAdmin
      .from('products')
      .select('image_url')
      .eq('id', id)
      .single();

    if (getError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete product
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }

    // Delete image from storage if exists
    if (product.image_url) {
      try {
        const fileName = product.image_url.split('/').pop();
        await supabaseAdmin.storage
          .from('product-images')
          .remove([fileName]);
      } catch (imageError) {
        console.error('Error deleting image:', imageError);
        // Don't fail the request if image deletion fails
      }
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new category
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category already exists
    const { data: existingCategory } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('name', name)
      .single();

    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Create category
    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert([{ name }])
      .select('*')
      .single();

    if (error) {
      console.error('Create category error:', error);
      return res.status(500).json({ error: 'Failed to create category' });
    }

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get users error:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
