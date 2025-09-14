const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const auth = require('../middleware/auth');

// GET /api/reviews/:productId - Fetch all reviews for a specific product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate productId
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Fetch reviews with user information
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        users!inner (
          id,
          email
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    // Format response
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      user: {
        id: review.users.id,
        email: review.users.email
      }
    }));

    res.json({
      reviews: formattedReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length
    });

  } catch (error) {
    console.error('Error in GET /api/reviews/:productId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/reviews/:productId - Create a new review for a product
router.post('/:productId', auth.authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const { data: existingReview, error: existingReviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .single();

    if (existingReviewError && existingReviewError.code !== 'PGRST116') {
      console.error('Error checking existing review:', existingReviewError);
      return res.status(500).json({ error: 'Failed to check existing review' });
    }

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Check if user has purchased this product
    const { data: purchase, error: purchaseError } = await supabase
      .from('order_items')
      .select(`
        id,
        orders!inner (
          user_id,
          status
        )
      `)
      .eq('product_id', productId)
      .eq('orders.user_id', userId)
      .eq('orders.status', 'completed')
      .limit(1);

    if (purchaseError) {
      console.error('Error checking purchase:', purchaseError);
      return res.status(500).json({ error: 'Failed to verify purchase' });
    }

    if (!purchase || purchase.length === 0) {
      return res.status(400).json({ 
        error: 'You can only review products you have purchased' 
      });
    }

    // Create the review
    const { data: newReview, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: userId,
        rating: rating,
        comment: comment || null
      })
      .select(`
        id,
        rating,
        comment,
        created_at,
        users!inner (
          id,
          email
        )
      `)
      .single();

    if (reviewError) {
      console.error('Error creating review:', reviewError);
      return res.status(500).json({ error: 'Failed to create review' });
    }

    // Format response
    const formattedReview = {
      id: newReview.id,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: newReview.created_at,
      user: {
        id: newReview.users.id,
        email: newReview.users.email
      }
    };

    res.status(201).json({
      message: 'Review created successfully',
      review: formattedReview
    });

  } catch (error) {
    console.error('Error in POST /api/reviews/:productId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/reviews/:reviewId - Update an existing review
router.put('/:reviewId', auth.authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!reviewId) {
      return res.status(400).json({ error: 'Review ID is required' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if review exists and belongs to user
    const { data: existingReview, error: existingReviewError } = await supabase
      .from('reviews')
      .select('id, user_id')
      .eq('id', reviewId)
      .single();

    if (existingReviewError || !existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existingReview.user_id !== userId) {
      return res.status(403).json({ error: 'You can only update your own reviews' });
    }

    // Update the review
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({
        rating: rating,
        comment: comment || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select(`
        id,
        rating,
        comment,
        created_at,
        users!inner (
          id,
          email
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating review:', updateError);
      return res.status(500).json({ error: 'Failed to update review' });
    }

    // Format response
    const formattedReview = {
      id: updatedReview.id,
      rating: updatedReview.rating,
      comment: updatedReview.comment,
      createdAt: updatedReview.created_at,
      user: {
        id: updatedReview.users.id,
        email: updatedReview.users.email
      }
    };

    res.json({
      message: 'Review updated successfully',
      review: formattedReview
    });

  } catch (error) {
    console.error('Error in PUT /api/reviews/:reviewId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/reviews/:reviewId - Delete a review
router.delete('/:reviewId', auth.authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Validate input
    if (!reviewId) {
      return res.status(400).json({ error: 'Review ID is required' });
    }

    // Check if review exists and belongs to user
    const { data: existingReview, error: existingReviewError } = await supabase
      .from('reviews')
      .select('id, user_id')
      .eq('id', reviewId)
      .single();

    if (existingReviewError || !existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (existingReview.user_id !== userId) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    // Delete the review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (deleteError) {
      console.error('Error deleting review:', deleteError);
      return res.status(500).json({ error: 'Failed to delete review' });
    }

    res.json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error('Error in DELETE /api/reviews/:reviewId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
