const express = require('express');
const router = express.Router();
const {
  createPolicy,
  getPolicies,
  getAllPolicies,
  getPolicy,
  updatePolicy,
  deletePolicy
} = require('../controllers/policyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getPolicies);
router.get('/all', protect, authorize('agent', 'admin'), getAllPolicies);
router.get('/:id', protect, getPolicy);
router.post('/', protect, authorize('agent'), createPolicy);
router.put('/:id', protect, authorize('agent', 'admin'), updatePolicy);
router.delete('/:id', protect, authorize('agent', 'admin'), deletePolicy);

module.exports = router;
