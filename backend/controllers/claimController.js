const Claim = require('../models/Claim');
const Purchase = require('../models/Purchase');

// @desc    Submit a claim (Customer)
// @route   POST /api/claims
exports.submitClaim = async (req, res) => {
  try {
    const { purchaseId, description, claimAmount } = req.body;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase || purchase.status !== 'active') {
      return res.status(400).json({ message: 'No active purchase found' });
    }

    const claim = await Claim.create({
      purchase: purchaseId,
      customer: req.user._id,
      description,
      claimAmount
    });

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my claims (Customer)
// @route   GET /api/claims
exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ customer: req.user._id })
      .populate({
        path: 'purchase',
        populate: { path: 'policy', select: 'title type' }
      })
      .populate('processedBy', 'name')
      .sort('-createdAt');
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all claims (Agent/Admin)
// @route   GET /api/claims/all
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate('customer', 'name email phone')
      .populate({
        path: 'purchase',
        populate: { path: 'policy', select: 'title type coverageAmount' }
      })
      .populate('processedBy', 'name')
      .sort('-createdAt');
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process a claim (Agent - approve/reject)
// @route   PUT /api/claims/:id/process
exports.processClaim = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    claim.status = status;
    claim.remarks = remarks || '';
    claim.processedBy = req.user._id;
    await claim.save();

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
