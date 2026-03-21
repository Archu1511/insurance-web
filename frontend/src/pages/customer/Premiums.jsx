import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiDollarSign } from 'react-icons/fi';
import UPIPaymentModal from '../../components/UPIPaymentModal';

const Premiums = () => {
  const [premiums, setPremiums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(null); // { premiumId, amount }

  const fetchPremiums = async () => {
    try {
      const { data } = await axios.get('/api/premiums');
      setPremiums(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPremiums(); }, []);

  const handlePayClick = (premium) => {
    setPaymentModal({ premiumId: premium._id, amount: premium.amount });
  };

  const handlePaymentSuccess = () => {
    setPaymentModal(null);
    toast.success('Premium paid successfully!');
    fetchPremiums();
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Premium Payments</h1>
        <p>Manage and pay your policy premiums via UPI</p>
      </div>

      {premiums.length === 0 ? (
        <div className="empty-state">
          <FiDollarSign />
          <h3>No premiums found</h3>
          <p>Purchase a policy to see your premiums</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Policy</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {premiums.map(p => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.purchase?.policy?.title || 'N/A'}</td>
                  <td>₹{p.amount}</td>
                  <td>{new Date(p.dueDate).toLocaleDateString()}</td>
                  <td>{p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '—'}</td>
                  <td><span className={`badge ${p.status}`}>{p.status}</span></td>
                  <td>
                    {p.status !== 'paid' && (
                      <button className="btn btn-success btn-sm" onClick={() => handlePayClick(p)}>Pay via UPI</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* UPI Payment Modal */}
      {paymentModal && (
        <UPIPaymentModal
          amount={paymentModal.amount}
          premiumId={paymentModal.premiumId}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPaymentModal(null)}
        />
      )}
    </div>
  );
};

export default Premiums;
