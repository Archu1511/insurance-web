import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiShield } from 'react-icons/fi';
import UPIPaymentModal from '../../components/UPIPaymentModal';

const ViewPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(null); // { policyId, amount }

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const { data } = await axios.get('/api/policies');
        setPolicies(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchPolicies();
  }, []);

  const handlePurchaseClick = (policy) => {
    setPaymentModal({ policyId: policy._id, amount: policy.premiumAmount });
  };

  const handlePaymentSuccess = () => {
    setPaymentModal(null);
    toast.success('Policy purchased successfully! First premium paid via UPI.');
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Available Policies</h1>
        <p>Browse and purchase insurance policies</p>
      </div>

      {policies.length === 0 ? (
        <div className="empty-state">
          <FiShield />
          <h3>No policies available</h3>
          <p>Check back later for new policies</p>
        </div>
      ) : (
        <div className="policy-grid">
          {policies.map(policy => (
            <div className="policy-card" key={policy._id}>
              <span className="policy-type"><FiShield /> {policy.type}</span>
              <h3>{policy.title}</h3>
              <p>{policy.description}</p>
              <div className="policy-meta">
                <div>
                  <span>Premium</span><br />
                  <strong>₹{policy.premiumAmount}/mo</strong>
                </div>
                <div>
                  <span>Coverage</span><br />
                  <strong>₹{policy.coverageAmount}</strong>
                </div>
                <div>
                  <span>Duration</span><br />
                  <strong>{policy.duration} months</strong>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => handlePurchaseClick(policy)}>
                Purchase Policy
              </button>
            </div>
          ))}
        </div>
      )}

      {/* UPI Payment Modal */}
      {paymentModal && (
        <UPIPaymentModal
          amount={paymentModal.amount}
          policyId={paymentModal.policyId}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPaymentModal(null)}
        />
      )}
    </div>
  );
};

export default ViewPolicies;
