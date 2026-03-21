const express = require('express');
const router = express.Router();
const {
  getUsers,
  toggleUserStatus,
  deleteUser,
  getAllPoliciesAdmin,
  updatePolicyStatus,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/policies', getAllPoliciesAdmin);
router.put('/policies/:id/status', updatePolicyStatus);

module.exports = router;
