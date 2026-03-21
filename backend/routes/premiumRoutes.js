const express = require('express');
const router = express.Router();
const {
  getMyPremiums,
  payPremium,
  getAllPremiums
} = require('../controllers/premiumController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('customer'), getMyPremiums);
router.put('/:id/pay', protect, authorize('customer'), payPremium);
router.get('/all', protect, authorize('agent', 'admin'), getAllPremiums);

module.exports = router;
