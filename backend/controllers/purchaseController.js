const Purchase = require('../models/Purchase');
const Policy = require('../models/Policy');
const Premium = require('../models/Premium');

// @desc    Purchase a policy (Customer)
// @route   POST /api/purchases
exports.purchasePolicy = async (req, res) => {
  try {
    const { policyId } = req.body;

    const policy = await Policy.findById(policyId);
    if (!policy || policy.status !== 'active') {
      return res.status(400).json({ message: 'Policy not available' });
    }

    // Check if already purchased
    const existingPurchase = await Purchase.findOne({
      customer: req.user._id,
      policy: policyId,
      status: 'active'
    });
    if (existingPurchase) {
      return res.status(400).json({ message: 'You already have this policy' });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + policy.duration);

    const purchase = await Purchase.create({
      customer: req.user._id,
      policy: policyId,
      startDate,
      endDate
    });

    // Create premium records (monthly)
    const premiums = [];
    for (let i = 0; i < policy.duration; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      premiums.push({
        purchase: purchase._id,
        customer: req.user._id,
        amount: policy.premiumAmount,
        dueDate
      });
    }
    await Premium.insertMany(premiums);

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer's purchases
// @route   GET /api/purchases
exports.getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ customer: req.user._id })
      .populate('policy')
      .sort('-createdAt');
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all purchases (Agent/Admin)
// @route   GET /api/purchases/all
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('policy')
      .populate('customer', 'name email phone')
      .sort('-createdAt');
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a purchase
// @route   PUT /api/purchases/:id/cancel
exports.cancelPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    purchase.status = 'cancelled';
    await purchase.save();
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
