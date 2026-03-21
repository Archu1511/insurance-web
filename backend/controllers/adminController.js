const User = require('../models/User');
const Policy = require('../models/Policy');
const Purchase = require('../models/Purchase');
const Premium = require('../models/Premium');
const Claim = require('../models/Claim');

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const users = await User.find(filter).select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user active status (Admin)
// @route   PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all policies for admin (including pending)
// @route   GET /api/admin/policies
exports.getAllPoliciesAdmin = async (req, res) => {
  try {
    const policies = await Policy.find().populate('createdBy', 'name email');
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or deactivate a policy (Admin)
// @route   PUT /api/admin/policies/:id/status
exports.updatePolicyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const policy = await Policy.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalPolicies = await Policy.countDocuments();
    const activePolicies = await Policy.countDocuments({ status: 'active' });
    const totalPurchases = await Purchase.countDocuments();
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'pending' });
    const totalPremiumsPaid = await Premium.countDocuments({ status: 'paid' });

    const paidPremiums = await Premium.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalCustomers,
      totalAgents,
      totalPolicies,
      activePolicies,
      totalPurchases,
      totalClaims,
      pendingClaims,
      totalPremiumsPaid,
      totalRevenue: paidPremiums[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
