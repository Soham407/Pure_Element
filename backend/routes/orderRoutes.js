const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

// Create new order (authenticated)
router.post('/', authenticateToken, createOrder);

// My orders (authenticated)
router.get('/my', authenticateToken, getMyOrders);

// All orders (admin only)
router.get('/all', authenticateToken, requireAdmin, getAllOrders);

// Update order status (admin only)
router.patch('/:orderId/status', authenticateToken, requireAdmin, updateOrderStatus);

module.exports = router;


