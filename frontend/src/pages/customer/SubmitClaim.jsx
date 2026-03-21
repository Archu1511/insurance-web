import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SubmitClaim = () => {
  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState({ purchaseId: '', description: '', claimAmount: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const { data } = await axios.get('/api/purchases');
        setPurchases(data.filter(p => p.status === 'active'));
      } catch (err) { console.error(err); }
    };
    fetchPurchases();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/claims', form);
      toast.success('Claim submitted successfully!');
      setForm({ purchaseId: '', description: '', claimAmount: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit claim');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Submit a Claim</h1>
        <p>File an insurance claim against your active policies</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Policy</label>
            <select name="purchaseId" className="form-control" value={form.purchaseId} onChange={handleChange} required>
              <option value="">-- Select a policy --</option>
              {purchases.map(p => (
                <option key={p._id} value={p._id}>{p.policy?.title} ({p.policy?.type})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Claim Amount (₹)</label>
            <input type="number" name="claimAmount" className="form-control" value={form.claimAmount} onChange={handleChange} placeholder="Enter claim amount" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-control" value={form.description} onChange={handleChange} placeholder="Describe your claim in detail..." required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitClaim;
