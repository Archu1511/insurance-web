import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiX, FiShield } from 'react-icons/fi';

const UPIPaymentModal = ({ amount, premiumId, policyId, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create order on backend
      const { data: order } = await axios.post('/api/payments/create-order', {
        amount,
        premiumId: premiumId || null,
        policyId: policyId || null
      });

      // Step 2: Open Razorpay Checkout (handles UPI QR, cards, etc.)
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'InsureVault',
        description: premiumId ? 'Premium Payment' : 'Policy Purchase',
        order_id: order.orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            await axios.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: order._id,
              policyId: policyId || null
            });

            setPaymentDetails({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            });
            setPaymentStatus('success');
            setTimeout(() => {
              onSuccess && onSuccess();
            }, 2500);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#6c5ce7'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not initiate payment');
      setLoading(false);
    }
  };

  // Success screen
  if (paymentStatus === 'success') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal upi-modal" onClick={(e) => e.stopPropagation()}>
          <div className="upi-success">
            <div className="upi-success-icon">
              <FiCheckCircle />
            </div>
            <h2>Payment Successful!</h2>
            <p className="upi-success-amount">₹{amount}</p>
            {paymentDetails && (
              <p className="upi-success-txn">Payment ID: {paymentDetails.paymentId}</p>
            )}
            <div className="upi-success-details">
              <span>Paid via Razorpay</span>
            </div>
            <button className="btn btn-primary upi-done-btn" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal upi-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="upi-modal-header">
          <div>
            <h2>Make Payment</h2>
            <p className="upi-modal-amount">Pay <strong>₹{amount}</strong></p>
          </div>
          <button className="upi-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="upi-content">
          <div className="razorpay-info">
            <div className="razorpay-info-icon">
              <FiShield />
            </div>
            <h3>Secure Payment via Razorpay</h3>
            <p>Pay using UPI, Debit/Credit Card, Net Banking, Wallets & more</p>

            <div className="razorpay-methods">
              <span className="razorpay-method-badge">UPI / QR</span>
              <span className="razorpay-method-badge">Cards</span>
              <span className="razorpay-method-badge">Net Banking</span>
              <span className="razorpay-method-badge">Wallets</span>
            </div>
          </div>

          <button
            className="btn btn-primary upi-pay-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </div>

        {/* Footer */}
        <div className="upi-footer">
          <div className="upi-secure">
            <FiShield /> Secured by Razorpay
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentModal;
