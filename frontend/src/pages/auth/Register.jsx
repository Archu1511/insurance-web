import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', form);
      login(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>InsureVault</h1>
        <p className="subtitle">Create your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} placeholder="9876543210" />
            </div>
          </div>
          <div className="form-group">
            <label>Register As</label>
            <select name="role" className="form-control" value={form.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="agent">Insurance Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
