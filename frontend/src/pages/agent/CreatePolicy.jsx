import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatePolicy = () => {
  const [form, setForm] = useState({
    title: '', description: '', type: 'Health', premiumAmount: '', coverageAmount: '', duration: 12
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/policies', form);
      toast.success('Policy created successfully!');
      navigate('/manage-policies');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create policy');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Create New Policy</h1>
        <p>Design a new insurance policy</p>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Policy Title</label>
            <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} placeholder="e.g., Premium Health Shield" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-control" value={form.description} onChange={handleChange} placeholder="Describe the policy benefits..." required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Policy Type</label>
              <select name="type" className="form-control" value={form.type} onChange={handleChange}>
                <option>Health</option>
                <option>Life</option>
                <option>Vehicle</option>
                <option>Home</option>
                <option>Travel</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration (months)</label>
              <input type="number" name="duration" className="form-control" value={form.duration} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Premium Amount (₹/month)</label>
              <input type="number" name="premiumAmount" className="form-control" value={form.premiumAmount} onChange={handleChange} placeholder="500" required />
            </div>
            <div className="form-group">
              <label>Coverage Amount (₹)</label>
              <input type="number" name="coverageAmount" className="form-control" value={form.coverageAmount} onChange={handleChange} placeholder="500000" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Policy'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePolicy;
