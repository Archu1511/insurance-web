const express = require('express');
const router = express.Router();
const {
  purchasePolicy,
  getMyPurchases,
  getAllPurchases,
  cancelPurchase
} = require('../controllers/purchaseController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), purchasePolicy);
router.get('/', protect, authorize('customer'), getMyPurchases);
router.get('/all', protect, authorize('agent', 'admin'), getAllPurchases);
router.put('/:id/cancel', protect, cancelPurchase);

module.exports = router;
