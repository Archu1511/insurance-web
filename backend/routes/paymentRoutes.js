const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyPayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/create-order', protect, authorize('customer'), createOrder);
router.post('/verify', protect, authorize('customer'), verifyPayment);
router.get('/', protect, authorize('customer'), getMyPayments);

module.exports = router;
