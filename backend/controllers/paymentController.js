const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Premium = require('../models/Premium');
const Purchase = require('../models/Purchase');
const Policy = require('../models/Policy');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  try {
    const { amount, premiumId, policyId } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
      notes: {
        customerId: req.user._id.toString(),
        premiumId: premiumId || '',
        policyId: policyId || ''
      }
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      customer: req.user._id,
      premium: premiumId || null,
      amount,
      razorpayOrderId: order.id,
      status: 'pending'
    });

    res.status(201).json({
      _id: payment._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      policyId
    } = req.body;

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed - invalid signature' });
    }

    // Update payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'completed';
    await payment.save();

    // If payment is for a premium, mark it as paid
    if (payment.premium) {
      const premium = await Premium.findById(payment.premium);
      if (premium && premium.status !== 'paid') {
        premium.status = 'paid';
        premium.paidDate = new Date();
        await premium.save();
      }
    }

    // If policyId provided, create a purchase
    if (policyId) {
      const policy = await Policy.findById(policyId);
      if (policy && policy.status === 'active') {
        const existingPurchase = await Purchase.findOne({
          customer: req.user._id,
          policy: policyId,
          status: 'active'
        });

        if (!existingPurchase) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + policy.duration);

          const purchase = await Purchase.create({
            customer: req.user._id,
            policy: policyId,
            startDate,
            endDate
          });

          const premiums = [];
          for (let i = 0; i < policy.duration; i++) {
            const dueDate = new Date(startDate);
            dueDate.setMonth(dueDate.getMonth() + i);
            premiums.push({
              purchase: purchase._id,
              customer: req.user._id,
              amount: policy.premiumAmount,
              dueDate,
              status: i === 0 ? 'paid' : 'pending',
              paidDate: i === 0 ? new Date() : null
            });
          }
          await Premium.insertMany(premiums);

          payment.purchase = purchase._id;
          await payment.save();
        }
      }
    }

    res.json({
      _id: payment._id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'completed',
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my payment history
// @route   GET /api/payments
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.user._id })
      .populate('premium')
      .populate({
        path: 'purchase',
        populate: { path: 'policy', select: 'title type' }
      })
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
