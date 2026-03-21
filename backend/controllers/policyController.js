const Policy = require('../models/Policy');

// @desc    Create a new policy (Agent only)
// @route   POST /api/policies
exports.createPolicy = async (req, res) => {
  try {
    const { title, description, type, premiumAmount, coverageAmount, duration } = req.body;

    const policy = await Policy.create({
      title,
      description,
      type,
      premiumAmount,
      coverageAmount,
      duration,
      createdBy: req.user._id
    });

    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active policies (for customers)
// @route   GET /api/policies
exports.getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find({ status: 'active' }).populate('createdBy', 'name email');
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all policies (for agents - includes pending/inactive)
// @route   GET /api/policies/all
exports.getAllPolicies = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'agent') {
      filter.createdBy = req.user._id;
    }
    const policies = await Policy.find(filter).populate('createdBy', 'name email');
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single policy
// @route   GET /api/policies/:id
exports.getPolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id).populate('createdBy', 'name email');
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update policy (Agent only)
// @route   PUT /api/policies/:id
exports.updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete policy (Agent only)
// @route   DELETE /api/policies/:id
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
