const express = require('express');
const router = express.Router();
const {
  submitClaim,
  getMyClaims,
  getAllClaims,
  processClaim
} = require('../controllers/claimController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), submitClaim);
router.get('/', protect, authorize('customer'), getMyClaims);
router.get('/all', protect, authorize('agent', 'admin'), getAllClaims);
router.put('/:id/process', protect, authorize('agent'), processClaim);

module.exports = router;
