const Premium = require('../models/Premium');

// @desc    Get my premiums (Customer)
// @route   GET /api/premiums
exports.getMyPremiums = async (req, res) => {
  try {
    const premiums = await Premium.find({ customer: req.user._id })
      .populate({
        path: 'purchase',
        populate: { path: 'policy', select: 'title type' }
      })
      .sort('dueDate');
    res.json(premiums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pay a premium (Customer)
// @route   PUT /api/premiums/:id/pay
exports.payPremium = async (req, res) => {
  try {
    const premium = await Premium.findById(req.params.id);
    if (!premium) {
      return res.status(404).json({ message: 'Premium not found' });
    }
    if (premium.status === 'paid') {
      return res.status(400).json({ message: 'Premium already paid' });
    }

    premium.status = 'paid';
    premium.paidDate = new Date();
    await premium.save();

    res.json(premium);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all premiums (Agent/Admin)
// @route   GET /api/premiums/all
exports.getAllPremiums = async (req, res) => {
  try {
    const premiums = await Premium.find()
      .populate('customer', 'name email')
      .populate({
        path: 'purchase',
        populate: { path: 'policy', select: 'title type' }
      })
      .sort('-createdAt');
    res.json(premiums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
